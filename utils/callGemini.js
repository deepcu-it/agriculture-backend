import { GoogleGenerativeAI } from "@google/generative-ai";
import RawChatHistory from "../models/RawChatHistory.js";


const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBPFw540bTS24RnD9lBMd_7HPmO-uh8v2Y";
if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(apiKey);

export const callGemini = async (prompt, modelName = "gemini-2.0-flash") => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([prompt]);
    await RawChatHistory.create({ chathistory: result.response.text() });
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}