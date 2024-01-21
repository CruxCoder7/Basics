import { Prisma } from "@prisma/client"
import crypto from "crypto"
import { Request, Response } from "express"
import prisma from "../db"
import UnauthenticatedError from "../errors/unauthenticated"
import { Transaction } from "../types/Transaction"
import { send_mail } from "../utils/send_mail"
import { spawn_process } from "../utils/spawn_process"

export default class TransactionController {
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

    const past_transactions_json = user.transactions as Prisma.JsonObject
    const past_transaction_data = past_transactions_json[
      "data"
    ]! as Prisma.JsonArray

    past_transaction_data.push({ txid, amount, acc_no, category, name })

    if (!amount_detection.includes("Flagged")) {
      await prisma.user.update({
        where: { email: res.locals.user.email },
        data: {
          transactions: {
            data: past_transaction_data,
          },
        },
      })
      return res.json({ msg: "unflagged" })
    }

    const email_key = crypto.randomInt(10000, 99999).toString()
    const { id: transaction_id } = await prisma.flagged_Transactions.create({
      data: {
        email_key,
        transaction: req.body,
        userId: user.id,
      },
    })

    const email_resp = await send_mail(user.email, email_key, transaction_id)
    if (email_resp) return res.json({ msg: "email sent" })
  }

  static async checkTransaction(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const txn = await prisma.flagged_Transactions.findUnique({ where: { id } })
    if (!txn) return res.json(false)
    return res.json(txn)
  }

  static async updateTransaction(req: Request, res: Response) {
    const { cancelled, id }: { cancelled: boolean; id: number } = req.body

    const transaction = await prisma.flagged_Transactions.update({
      where: { id },
      data: {
        cancelled,
        processed: true,
      },
    })

    res.json(transaction)
  }
}
