import express from "express"
import UserController from "../controllers/UserController.js"

const userController = new UserController()
const router = express.Router()

router.post("/create", userController.create)
router.get("/read", userController.read)
router.put("/update/:id", userController.update)
router.delete("/delete/:id", userController.delete)

export default router
