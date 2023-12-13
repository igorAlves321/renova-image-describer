import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class UserController {
    async create(req, res) {
        const user = await prisma.user.create({
            data: req.body,
        })
        return res.status(201).json(user)
    }

    async read(req, res) {
        const users = await prisma.user.findMany()
        return res.status(200).json(users)
    }

    async update(req, res) {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: req.body,
        })
        return res.status(200).json(user)
    }

    async delete(req, res) {
        const user = await prisma.user.delete({
            where: { id: req.params.id },
        })
        return res.status(200).json(user)
    }
}

export default UserController
