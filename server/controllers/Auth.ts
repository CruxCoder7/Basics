import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from "../db";
import PlatformError from "../errors/custom-error";
import { createToken } from "../utils/jwt";

export default class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password }: User = req.body
        console.log(email, password)
        const user = await prisma.user.findFirst({ where: { email } })
        if (!user) throw new PlatformError("User does not exist", 404)

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new PlatformError("Invalid Credentials", 401)

        const token = createToken(user)
        res.cookie("access-token", token, { maxAge: 5 * 60 * 60 * 1000 })
        return res.json(user)
    }

    static async register(req: Request, res: Response) {
        const { email, password, name, phone_number }: User = req.body
        const check = await prisma.user.findUnique({ where: { email, phone_number } })
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
    }
}