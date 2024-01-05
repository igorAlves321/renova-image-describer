// clearData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
    try {
        await prisma.user.deleteMany({});
        console.log('Todos os dados de usuários foram removidos.');
    } catch (error) {
        console.error('Erro ao limpar dados:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearData();
