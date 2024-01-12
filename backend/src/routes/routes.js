import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import UserController from "../controllers/UserController.js";
import ImageController from "../controllers/ImageController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const prisma = new PrismaClient();
const userController = new UserController();
const imageController = new ImageController();
const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) {
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

// Rotas do UserController
router.post("/create", userController.create);
router.get("/read", authenticateToken, userController.read);
router.get("/:id", authenticateToken, userController.getById);
router.put("/update/:id", authenticateToken, userController.update);
router.delete("/delete/:id", authenticateToken, userController.delete);

// Rota para obter descrições de imagens de um usuário
router.get("/user/:userId/images", authenticateToken, userController.getUserImageDescriptions);

// Rota para limpar o histórico de um usuário
router.delete("/user/:userId/clear-history", authenticateToken, imageController.clearHistory);

// Rotas do ImageController
router.post("/image", authenticateToken, imageController.getDetails);

export default router;
