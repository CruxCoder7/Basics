import crypto from 'crypto';
import csvParser from "csv-parser";
import { Request, Response } from "express";
import fs from 'fs';
import prisma from "../db";
import UnauthenticatedError from "../errors/unauthenticated";
import { Transaction } from "../types/Transaction";
import { send_mail } from "../utils/send_mail";
import { spawn_process } from "../utils/spawn_process";
import { compute_transaction_mean, sanitize_transaction_data } from "../utils/transaction";

export default class UserController {
    static async getUser(req: Request, res: Response) {
        function exclude<User, Key extends keyof User>(user: User, keys: Key[]) {
            return Object.fromEntries(
                Object.entries(user as any).filter(([key]) => !keys.includes(key as any))
            )
        }
        const { email } = res.locals.user
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        const userWithoutPassword = exclude(user, ["password" as never])
        res.json(userWithoutPassword)
    }

    static async dashboard(req: Request, res: Response) {
        res.json({
            auth: res.locals.authenticated,
            user: res.locals.user,
        })
    }

    static async profile(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).send("No file uploaded.")
        }

        const user = res.locals.user

        const filePath = req.file.path
        const results: any[] = []

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (data) => results.push(data))
                .on("end", resolve)
                .on("error", reject)
        })

        const transaction_history = sanitize_transaction_data(results)

        const transaction_mean = compute_transaction_mean(transaction_history)
        console.log("transaction_mean:", transaction_mean)

        const model_response = await spawn_process(
            "../server/model_calls/amount_classification.py",
            { mean: transaction_mean }
        )
        console.log("model_response: ", model_response);
        const isHighSpender = model_response.includes("High") ? true : false

        const updated_user = await prisma.user.update({
            where: { email: user.email },
            data: {
                transactions: { data: transaction_history },
                isHighSpender,
            },
        })

        res.json(updated_user)
    }

    static async transaction(req: Request, res: Response) {
        const { txid, amount, acc_no, category, name }: Transaction = req.body

        const user = await prisma.user.findUnique({
            where: { email: res.locals.user.email },
        })

        if (!user) throw new UnauthenticatedError("User not logged in!")

        // detection based on just amount
        const model_path = user.isHighSpender
            ? "../models/amount_cluster_segment1isolationForest.pkl"
            : "../models/amount_cluster_segment0isolationForest.pkl"

        const amount_detection: string = await spawn_process(
            "../server/model_calls/amount_based_detection.py",
            { amount, model_path }
        )

        if (!amount_detection.includes("Flagged"))
            return res.json({ msg: "email not sent, the transaction is not tagged!" })

        const email_key = crypto.randomInt(10000, 99999).toString()
        await prisma.flagged_Transactions.create({
            data: {
                email_key,
                transaction: req.body,
                userId: user.id,
            },
        })

        const email_resp = await send_mail(user.email, email_key)
        if (email_resp) return res.json({ msg: "email sent" })
    }
}