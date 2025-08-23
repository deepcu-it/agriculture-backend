import { callGemini } from "../utils/callGemini.js";
import { saveChatHistory } from "../utils/saveChatHistory.js";

export const geminiCall = async (req, res) => {
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

    // Construct Gemini prompt
    const prompt = `You are an expert agricultural assistant. Based on the following details, provide insights and recommendations (~300 words).
Year: ${year}
Crop: ${crop}
Region: ${JSON.stringify(region)}
Soil Quality: ${soil_quality}
Rainfall: ${rainfall}
Temperature: ${temperature}
NDVI: ${ndvi} 
Yield: ${yieldData.value} ${yieldData.unit}
Season: ${season} 
User Message: ${user_message}`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history (separated logic)
    const chatSession = await saveChatHistory({
      session_id,
      user_id,
      user_message,
      assistantResponse,
      year,
      crop,
      region,
      soil_quality,
      rainfall,
      temperature,
      ndvi,
      yieldData,
      season,
    });

    res.status(200).json({
      message: assistantResponse,
      session_id: chatSession.session_id,
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
