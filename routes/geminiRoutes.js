import express from "express";
import { geminiCall, commodityMarketData } from "../controllers/geminiController.js";

const router = express.Router();


router.route("/gemini-call").post(geminiCall);
router.route("/commodity-market-data").get(commodityMarketData);

export default router;