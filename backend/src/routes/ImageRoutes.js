import express from "express";
import ImageController from "../controllers/ImageController.js";
const imageController = new ImageController()

const router = express.Router()

router.post("/", imageController.getDetails)

export default router