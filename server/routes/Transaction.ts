import express from "express";
import { verifyToken } from "../utils/JWT";
import TransactionController from "../controllers/Transaction";

const TransactionRouter = express.Router();

TransactionRouter.post("/", verifyToken, TransactionController.transaction);

TransactionRouter.put("/", verifyToken, TransactionController.updateTransaction);

TransactionRouter.get(
  "/:id",
  verifyToken,
  TransactionController.checkTransaction
);

export default TransactionRouter;
