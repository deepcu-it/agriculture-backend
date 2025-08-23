import express from "express";
import {
  agriCopilot,
  agriVision,
  cropGPT,
  ecoAI,
  agriChat,
  getWeatherData,
  getPastWeatherData,
  getFutureWeatherData
} from "../controllers/agriController.js";

const router = express.Router();

router.post("/copilot", agriCopilot);      // multilingual chat
router.post("/vision", agriVision);        // yield predictor & storytelling
router.post("/crop-gpt", cropGPT);         // price & profitability insights
router.post("/eco-ai", ecoAI);             // climate impact analyzer
router.post("/chat", agriChat);            // brainstorming
router.get("/get-weather-data", getWeatherData);
router.get("/weather/past", getPastWeatherData);
router.get("/weather/forecast", getFutureWeatherData);

router


export default router;
