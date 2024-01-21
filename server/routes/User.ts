import express from "express"
import multer from "multer"
import UserController from "../controllers/User"
import { verifyToken } from "../utils/jwt"

const UserRouter = express.Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./uploads")
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage }).single("file")

UserRouter.get("/", verifyToken, UserController.getUser)
UserRouter.put("/", verifyToken, UserController.updateUser)
UserRouter.get("/dashboard", verifyToken, UserController.dashboard)
UserRouter.post("/profile", verifyToken, upload, UserController.profile)

export default UserRouter
