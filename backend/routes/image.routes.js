// routes/image.routes.js
import express from "express";
import { getTelegramImage } from "../controllers/image.controller.js";

const router = express.Router();

router.get("/:fileId", getTelegramImage);

export default router;
