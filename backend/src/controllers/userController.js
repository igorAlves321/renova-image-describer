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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 117c2a1ac6a0b097b8437db072a16611b2a0de8b
    async getById(req, res) {  // Nova função para obter um usuário pelo ID
        const id = req.params.id
        const user = await prisma.user.findUnique({
            where: { id },
        })
        if (user) {
            return res.status(200).json(user)
        } else {
            return res.status(404).send('Usuário não encontrado')
        }
    }

<<<<<<< HEAD
=======
=======
>>>>>>> a05b4b89edace4ccc3797c986407247f73b79ce7
>>>>>>> 117c2a1ac6a0b097b8437db072a16611b2a0de8b
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
