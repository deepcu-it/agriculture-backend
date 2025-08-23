import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../models/chatHistory.js";

// API key from env
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBPFw540bTS24RnD9lBMd_7HPmO-uh8v2Y";
if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(apiKey);

const geminiCall = async (req, res) => {
  try {
    const {
      user_id,
      session_id,
      user_message,
      year,
      crop,
      region,
      soil_quality,
      rainfall,
      temperature,
      ndvi,
      yield: yieldData,
      season,
    } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System instruction (fine-tuning behavior)
    const prompt = `
    You are an agricultural advisor AI. 
    The user will ask farming-related questions with details such as crop, season, soil quality, rainfall, etc.
    Generate a helpful, clear, and practical response of around 100 words. 
    Always adapt advice to the given region, crop, and conditions. 
    Avoid overly technical jargon and keep it farmer-friendly.
    
    User Question: ${user_message}
    Context: Year=${year}, Crop=${crop}, Region=${JSON.stringify(
      region
    )}, Soil Quality=${soil_quality}, Rainfall=${rainfall}mm, Temperature=${temperature}°C, NDVI=${ndvi}, Yield=${yieldData.value} ${yieldData.unit}, Season=${season}.
    `;

    const result = await model.generateContent([prompt]);
    const assistantResponse = result.response.text();

    // Upsert chat history
    let chatSession = await ChatHistory.findOne({ session_id });
    if (!chatSession) {
      chatSession = new ChatHistory({
        session_id,
        user_id,
        user_message,
        year,
        crop,
        region,
        soil_quality,
        rainfall,
        temperature,
        ndvi,
        yield: yieldData,
        season,
        chat_history: [],
      });
    }

    // Add user + assistant messages
    await chatSession.addMessage("user", user_message);
    await chatSession.addMessage("assistant", assistantResponse);

    res.status(200).json({
      message: assistantResponse,
      session_id: chatSession.session_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { geminiCall };
