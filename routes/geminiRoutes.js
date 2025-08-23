import express from "express";
import { geminiCall } from "../controllers/geminiController.js";

const router = express.Router();


router.route("/gemini-call").post(geminiCall);

export default router;