import express from 'express';
import cors from 'cors';
import ImageRoutes from './src/routes/ImageRoutes.js';
import UserRoutes from './src/routes/UserRoutes.js';
import env from './src/environment.js';
import logger from './logger.js'; // Importe o logger com ES Modules

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", ImageRoutes);
app.use("/user", UserRoutes);

// Middleware de Tratamento de Erros
app.use((err, req, res, next) => {
    logger.error(`Erro: ${err.message}`);
    res.status(500).send('Ocorreu um erro no servidor.');
});

// Inicialização do servidor
app.listen(env.port, () => {
    logger.info(`Servidor ativo na porta ${env.port}`); // Usando logger para registrar
    console.log(`Servidor ativo na porta ${env.port}`); // Mensagem no console para confirmação visual
});
