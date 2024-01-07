import "express-async-errors"
import express, { Request, Response, urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import prisma from "./db"
import PlatformError from "./errors/custom-error"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import { createToken } from "./utils/JWT"
import errorHandlerMiddleware from "./errors/errorHandler"
config()

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET_KEY))

app.post("/register", async (req: Request, res: Response) => {
  const { email, password, name }: User = req.body
  const check = await prisma.user.findUnique({ where: { email } })
  if (check) throw new PlatformError("User already exists", 409)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
    },
  })

  return res.json(user)
})

app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: User = req.body

  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) throw new PlatformError("User does not exist", 404)

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new PlatformError("Invalid Credentials", 401)

  const token = createToken(user)
  res.cookie("access-token", token, { maxAge: 5 * 60 * 60 * 1000 })
  return res.json(user)
})

app.use(errorHandlerMiddleware)

app.listen(5000, () => console.log("PORT 5000"))
