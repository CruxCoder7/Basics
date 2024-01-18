import cookieParser from "cookie-parser"
import cors from "cors"
import { config } from "dotenv"
import express, { urlencoded } from "express"
import "express-async-errors"
import errorHandlerMiddleware from "./errors/errorHandler"
import AuthRouter from "./routes/Auth"
import UserRouter from "./routes/User"
import TransactionRouter from "./routes/Transaction"
config()

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
)

app.use(cookieParser(process.env.JWT_SECRET_KEY))

app.use("/user", UserRouter)
app.use("/auth", AuthRouter)
app.use("/transaction", TransactionRouter)

app.use(errorHandlerMiddleware)

app.listen(5000, () => console.log("PORT 5000"))
