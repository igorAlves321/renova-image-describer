import express from 'express';
import cors from 'cors';
import Routes from './src/routes/routes.js'; // Caminho atualizado para o novo arquivo de rotas unificado
import env from './src/environment.js';
import logger from './logger.js'; // Importação do logger

const app = express();

// Middleware para tratar requisições CORS e para parsear o corpo das requisições
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Montagem das rotas unificadas sob o prefixo '/api'
app.use('/', Routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    logger.error(`Erro: ${err.message}`);
    res.status(500).send('Ocorreu um erro no servidor.');
});

// Inicialização do servidor na porta especificada nas variáveis de ambiente
app.listen(env.port, () => {
    logger.info(`Servidor ativo na porta ${env.port}`); // Registro do evento de inicialização
    console.log(`Servidor ativo na porta ${env.port}`); // Mensagem de confirmação no console
});
