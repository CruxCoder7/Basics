import { User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import UnauthenticatedError from "../errors/unauthenticated"
import BadRequest from "../errors/bad-request"

const createToken = (user: User) => {
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      isHighSpender: user.isHighSpender,
    },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "5h" }
  )

  return token
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access-token"]
  if (!token) throw new UnauthenticatedError("User not authenticated")

  const user = jwt.verify(token, process.env.JWT_SECRET_KEY!)
  if (!user) throw new BadRequest("Invalid creds")

  res.locals.authenticated = true
  res.locals.user = user
  return next()
}

const isTokenExpired = (token: string) => {
  const decodedToken = jwt.decode(token)
  const dateNow = new Date()
  if (typeof decodedToken !== "string" && decodedToken !== null)
    return decodedToken.exp! < Math.round(dateNow.getTime() / 1000)
}

export { createToken, verifyToken, isTokenExpired }
