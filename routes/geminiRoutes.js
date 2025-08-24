import express from "express";
import { geminiCall, commodityMarketData } from "../controllers/geminiController.js";
import RawChatHistory from "../models/RawChatHistory.js";

const router = express.Router();


router.route("/gemini-call").post(geminiCall);
router.route("/commodity-market-data").get(commodityMarketData);

router.route("/remove-chat-history").delete(async (req, res) => {
  try {  
    await RawChatHistory.deleteMany({}); 
    res.status(200).json({ message: "Chat history removed successfully" }); 
  } catch (error) { 
    res.status(500).json({ message: "Internal server error" }); 
  } 
});

export default router;