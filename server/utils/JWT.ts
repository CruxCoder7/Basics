import { User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import UnauthenticatedError from "../errors/unauthenticated"
import BadRequest from "../errors/bad-request"

const createToken = (user: User) => {
  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "5h" }
  )

  return token
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access-token"]
  if (!token) throw new UnauthenticatedError("User not authenticated")

  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY!)
  if (!verify) throw new BadRequest("Invalid creds")

  console.log(verify)
  res.locals.authenticated = true
  return next()
}

export { createToken, verifyToken }
