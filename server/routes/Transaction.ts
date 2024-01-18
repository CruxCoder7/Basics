import express from "express"
import { verifyToken } from "../utils/jwt"
import UserController from "../controllers/User"

const TransactionRouter = express.Router()

TransactionRouter.post("/", verifyToken, UserController.transaction)

TransactionRouter.put("/", verifyToken, UserController.updateTransaction)

TransactionRouter.get("/:id", verifyToken, UserController.checkTransaction)

export default TransactionRouter
