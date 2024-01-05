import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import UserController from "../controllers/UserController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const prisma = new PrismaClient();
const userController = new UserController();
const router = express.Router();

// Rota de Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) {
            // Incluir o nome do usuário no token JWT
            const token = jwt.sign(
                { userId: user.id, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ token });
        } else {
            res.status(401).send("Credenciais inválidas");
        }
    } catch (error) {
        res.status(500).send("Erro no servidor");
    }
});

// Permitir que novos usuários se cadastrem sem autenticação
router.post("/create", userController.create);

// Rotas protegidas com autenticação
router.get("/read", authenticateToken, userController.read);
router.get("/:id", authenticateToken, userController.getById);

// Rotas protegidas, acessíveis apenas para administradores
router.put("/update/:id", authenticateToken, userController.update);
router.delete("/delete/:id", authenticateToken, userController.delete);

export default router;
