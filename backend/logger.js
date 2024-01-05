import winston from 'winston';

// Configure o transporte (transport) para arquivo
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logfile.log' })
    ]
});

// Exporte o logger configurado
export default logger;
