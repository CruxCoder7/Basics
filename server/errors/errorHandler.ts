import { NextFunction, Request, Response } from "express"
import PlatformError from "./custom-error"
import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PlatformError) {
    return res
      .status(err.statusCode)
      .json({ error: err.name, msg: err.message })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Something went wrong try again later")
}

export default errorHandlerMiddleware
