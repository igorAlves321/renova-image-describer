import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import logger from '../../logger.js'; // Ajuste o caminho conforme necessário

const prisma = new PrismaClient();

class UserController {
    async create(req, res) {
        const { name, email, password, role } = req.body;

        // Verifica se já existe um usuário com o mesmo email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).send("Email já está em uso");
        }

        const isAdmin = req.user && req.user.role === 'admin';
        const assignedRole = isAdmin && role ? role : 'user';
        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: assignedRole,
                },
            });
            return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (error) {
            logger.error(`Erro ao criar usuário: ${error.message}`);
            return res.status(500).send('Erro ao criar o usuário');
        }
    }

    async read(req, res) {
        try {
            const users = await prisma.user.findMany();
            const totalUsers = await prisma.user.count();
            return res.status(200).json({ totalUsers, users });
        } catch (error) {
            logger.error(`Erro ao ler usuários: ${error.message}`);
            return res.status(500).send('Erro ao ler usuários');
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).send('Usuário não encontrado');
            }
        } catch (error) {
            logger.error(`Erro ao buscar usuário: ${error.message}`);
            return res.status(500).send('Erro ao buscar usuário');
        }
    }

    async update(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;
        const { name, email, password, role } = req.body;

        try {
            const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    name: name || undefined,
                    email: email || undefined,
                    password: hashedPassword,
                    role: role || undefined,
                },
            });
            return res.status(200).json(updatedUser);
        } catch (error) {
            logger.error(`Erro ao atualizar usuário: ${error.message}`);
            return res.status(500).send('Erro ao atualizar usuário');
        }
    }

    async delete(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;

        try {
            await prisma.user.delete({
                where: { id },
            });
            return res.status(200).send('Usuário deletado com sucesso');
        } catch (error) {
            logger.error(`Erro ao deletar usuário: ${error.message}`);
            return res.status(500).send('Erro ao deletar usuário');
        }
    }
}

export default UserController;
