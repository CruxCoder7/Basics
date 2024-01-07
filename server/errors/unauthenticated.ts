import PlatformError from "./custom-error"
import { StatusCodes } from "http-status-codes"

class UnauthenticatedError extends PlatformError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
  }
}

export default UnauthenticatedError
