import "express-async-errors"
import express, { Request, Response, urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import prisma from "./db"
import PlatformError from "./errors/custom-error"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import { createToken, verifyToken } from "./utils/JWT"
import errorHandlerMiddleware from "./errors/errorHandler"
import { spawn } from "child_process"

config()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

app.use(urlencoded({ extended: true }))

app.use(cookieParser(process.env.JWT_SECRET_KEY))

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
  const user = await prisma.user.findUnique({
    where: {
      email: res.locals.user.email,
    },
  })
  res.json(user)
})

let runPy = new Promise(function (resolve, reject) {
  const pyProg = spawn("python", ["test.py", "50"])

  pyProg.stdout.on("data", function (data: Object) {
    console.log(data.toString())
    resolve(data)
  })

  pyProg.stderr.on("data", (data: any) => {
    console.log(data)
    reject(data)
  })
})

app.get("/test", (req, res) => {
  runPy.then(function (fromRunpy: any) {
    console.log(fromRunpy.toString())
    res.end(fromRunpy)
  })
})

app.use(errorHandlerMiddleware)

app.listen(5000, () => console.log("PORT 5000"))
