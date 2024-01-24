import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { enviarEmailDeAtivacao } from '../emailService.js';
import logger from '../../logger.js';

const prisma = new PrismaClient();

class UserController {
    // Método para criar um novo usuário
async create(req, res) {
    const { name, email, password, activationReason } = req.body;

    if (activationReason && activationReason.length > 2000) {
        return res.status(400).send("A justificativa de ativação deve ter no máximo 2000 caracteres");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(400).send("Email já está em uso");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user', // Define o papel padrão como 'user'
                activationReason
            },
        });

        return res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            activationReason: user.activationReason
        });
    } catch (error) {
        logger.error(`Erro ao criar usuário: ${error.message}`);
        return res.status(500).send('Erro ao criar o usuário');
    }
}
//função que permite que o administrador defina o papel do usuário, já que como padrão ele vai vir como user.
async setUserRole(req, res) {
    if (!(req.user && req.user.role === 'admin')) {
        return res.status(403).send('Acesso negado');
    }

    const { userId, newRole } = req.body;

    try {

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        return res.status(200).json({ message: 'Papel do usuário atualizado com sucesso', user: updatedUser });
    } catch (error) {
        logger.error(`Erro ao atualizar o papel do usuário: ${error.message}`);
        return res.status(500).send('Erro ao atualizar o papel do usuário');
    }
}

    // Método para ler todos os usuários

    async read(req, res) {
        try {
            const statusFilter = req.query.status;
            let filterConditions = {};

            // Aplica o filtro se um status específico for fornecido
            if (statusFilter) {
                filterConditions.status = statusFilter;
            }

            const users = await prisma.user.findMany({
                where: filterConditions
            });

            return res.status(200).json(users);
        } catch (error) {
            console.error(`Erro ao ler usuários: ${error.message}`);
            return res.status(500).send('Erro ao ler usuários');
        }
    }

    // Método para buscar um usuário por ID
    async getById(req, res) {
        const { id } = req.params;

        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).send('Usuário não encontrado');
            }

            return res.status(200).json(user);
        } catch (error) {
            logger.error(`Erro ao buscar usuário: ${error.message}`);
            return res.status(500).send('Erro ao buscar usuário');
        }
    }

    // Método para atualizar um usuário
    async update(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;

        try {
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

    // Método para deletar um usuário
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

    // Método para ativar um usuário
    async activateUser(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            return res.status(403).send('Acesso negado');
        }

        const { userId } = req.params;

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).send('Usuário não encontrado');
            }

            // Verifica se o usuário já está ativo
            if (user.status === 'ACTIVE') {
                return res.status(400).send('Usuário já está ativo');
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { status: 'ACTIVE' },
            });

            // Chama a função para enviar o e-mail de ativação
            await enviarEmailDeAtivacao(user.email, user.name);

            return res.status(200).json({ message: 'Usuário ativado com sucesso', user: updatedUser });
        } catch (error) {
            logger.error(`Erro ao ativar usuário: ${error.message}`);
            return res.status(500).send('Erro ao ativar usuário');
        }
    }

// Método para obter as descrições de imagens associadas a um usuário
    async getUserImageDescriptions(req, res) {
        const { userId } = req.params;

        try {
            const imageDescriptions = await prisma.imageDescription.findMany({
                where: { userId: userId }
            });

            if (imageDescriptions.length === 0) {
                return res.status(404).send('Nenhuma descrição de imagem encontrada para este usuário');
            }

            return res.status(200).json(imageDescriptions);
        } catch (error) {
            logger.error(`Erro ao buscar descrições de imagem: ${error.message}`);
            return res.status(500).send('Erro ao buscar descrições de imagem');
        }
    }
}

export default UserController;
