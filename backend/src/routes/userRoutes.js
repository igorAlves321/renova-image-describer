import express from "express"
import UserController from "../controllers/UserController.js"

const userController = new UserController()
const router = express.Router()

router.post("/create", userController.create)
router.get("/read", userController.read)
<<<<<<< HEAD
router.get("/:id", userController.getById)  // Nova rota para obter um usuário pelo ID
=======
<<<<<<< HEAD
router.get("/:id", userController.getById)  // Nova rota para obter um usuário pelo ID
=======
>>>>>>> a05b4b89edace4ccc3797c986407247f73b79ce7
>>>>>>> 117c2a1ac6a0b097b8437db072a16611b2a0de8b
router.put("/update/:id", userController.update)
router.delete("/delete/:id", userController.delete)

export default router
