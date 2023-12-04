import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class UserController {
    async create(req, res) {
        return res.status(200).send({
            message: "Hello world!"
        })
    }
}

export default UserController