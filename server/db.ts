import { PrismaClient } from "@prisma/client"

let prisma = new PrismaClient({
  errorFormat: "pretty",
})

export default prisma
