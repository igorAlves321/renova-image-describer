import jwt from 'jsonwebtoken';
import env from '../environment.js'; // Ajuste o caminho se necessário

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Sem token, não autorizado

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido
        req.user = user;
        next();
    });
}

export default authenticateToken;
