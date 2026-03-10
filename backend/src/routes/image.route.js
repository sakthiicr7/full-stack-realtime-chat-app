import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generateImage } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/generate", protectRoute, generateImage);

export default router;
