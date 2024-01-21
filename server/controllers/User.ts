import { Prisma, User } from "@prisma/client"
import csvParser from "csv-parser"
import { Request, Response } from "express"
import fs from "fs"
import prisma from "../db"
import UnauthenticatedError from "../errors/unauthenticated"
import { Transaction } from "../types/Transaction"
import exclude from "../utils/exclude_property"
import { spawn_process } from "../utils/spawn_process"
import {
  compute_transaction_mean,
  sanitize_transaction_data,
} from "../utils/transaction"

export default class UserController {
  static async getUser(req: Request, res: Response) {
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
    const { email: user_email }: User = res.locals.user

    //get all flagged transactions of the user
    const data = await prisma.user.findUnique({
      where: {
        email: user_email,
      },
      include: {
        Flagged_Transactions: {
          where: {
            cancelled: true,
          },
        },
      },
    })

    res.json(data)
  }

  static async profile(req: Request, res: Response) {
    //@ts-ignore
    if (!req.file) {
      return res.status(400).send("No file uploaded.")
    }

    const user = res.locals.user

    //@ts-ignore
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
    console.log("model_response: ", model_response)
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

  static async updateUser(req: Request, res: Response) {
    const { transaction: { acc_no, amount, category, name, txid } }: { transaction: Transaction } =
      req.body.transaction

    const { email } = res.locals.user

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthenticatedError("User does not exist")

    const past_transactions_json = user.transactions as Prisma.JsonObject
    const past_transaction_data = past_transactions_json[
      "data"
    ]! as Prisma.JsonArray

    past_transaction_data.push({ txid, amount, acc_no, category, name })

    const updated_user = await prisma.user.update({
      where: { email },
      data: {
        transactions: {
          data: past_transaction_data,
        },
      },
    })

    res.json(updated_user)
  }
}
