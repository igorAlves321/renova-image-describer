import express from "express"
import UserController from "../controllers/UserController.js"

const userController = new UserController()
const router = express.Router()

router.post("/create", userController.create)
router.get("/read", userController.read)
<<<<<<< HEAD
router.get("/:id", userController.getById)  // Nova rota para obter um usuário pelo ID
=======
>>>>>>> a05b4b89edace4ccc3797c986407247f73b79ce7
router.put("/update/:id", userController.update)
router.delete("/delete/:id", userController.delete)

export default router
