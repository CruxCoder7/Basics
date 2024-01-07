import PlatformError from "./custom-error"
import { StatusCodes } from "http-status-codes"

class BadRequest extends PlatformError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST)
  }
}

export default BadRequest
