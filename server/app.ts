import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import cors from "cors"
import csv from "csv-parser"
import { config } from "dotenv"
import express, { Request, Response, urlencoded } from "express"
import "express-async-errors"
import fs from "fs"
import multer from "multer"
import prisma from "./db"
import PlatformError from "./errors/custom-error"
import errorHandlerMiddleware from "./errors/errorHandler"
import { createToken, verifyToken } from "./utils/JWT"
import {
  compute_transaction_mean,
  sanitize_transaction_data,
} from "./utils/transaction"
import { spawn } from "child_process"
import { spawn_process } from "./utils/spawn_process"

config()

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

app.use(cookieParser(process.env.JWT_SECRET_KEY))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads") // specify the destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // generate a unique filename
  },
})

const upload = multer({ storage }).single("file")

app.post("/register", async (req: Request, res: Response) => {
  const { email, password, name, phone_number }: User = req.body
  const check = await prisma.user.findUnique({ where: { email } })
  if (check) throw new PlatformError("User already exists", 409)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
      phone_number,
    },
  })

  const token = createToken(user)
  res.cookie("access-token", token, { maxAge: 5 * 60 * 60 * 1000 })

  return res.json(user)
})

app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: User = req.body
  console.log(email, password)
  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) throw new PlatformError("User does not exist", 404)

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new PlatformError("Invalid Credentials", 401)

  const token = createToken(user)
  res.cookie("access-token", token, { maxAge: 5 * 60 * 60 * 1000 })
  return res.json(user)
})

app.get("/dashboard", verifyToken, async (req: Request, res: Response) => {
  res.json({
    auth: res.locals.authenticated,
    user: res.locals.user,
  })
})

app.get("/user", verifyToken, async (req: Request, res: Response) => {
  const { email } = res.locals.user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  // @ts-ignore
  delete user.password

  res.json(user)
})

app.post(
  "/profile",
  verifyToken,
  upload,
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.")
    }

    const user = res.locals.user

    const filePath = req.file.path
    const results: any[] = []

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
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
)

app.get("/test", async (req, res) => {
  const model_response = await spawn_process(
    "../server/model_calls/amount_classification.py",
    { mean: 500 }
  )
  res.send(model_response)
})

app.use(errorHandlerMiddleware)

app.listen(5000, () => console.log("PORT 5000"))
