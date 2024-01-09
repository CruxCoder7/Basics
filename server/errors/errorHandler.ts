import { NextFunction, Request, Response } from "express"
import PlatformError from "./custom-error"
import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof PlatformError) {
    return res
      .status(err.statusCode)
      .json({ error: err.name, msg: err.message })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: err.name, msg: err.message })
}

export default errorHandlerMiddleware
