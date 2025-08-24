import { callGemini } from "../utils/callGemini.js";
import { saveChatHistory } from "../utils/saveChatHistory.js";
import RawChatHistory from "../models/RawChatHistory.js";


export const geminiCall = async (req, res) => {
  try {
    const {
      user_message
    } = req.body;
    const history = await RawChatHistory.find({});
    const prompt = `You are an AI assistant that provides information about Indian agriculture. Answer the following question: ${user_message}
    considering the previous chat history: ${history.map(h => h.chathistory).join("\n")}
    if there is no chat history, answer based on your knowledge only. 
    if user say hi, hello, hey, then greet them back in a friendly manner. no need to say anything provided chat history.
    if you don't know the answer, just say "I don't know"
    `;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);


    res.status(200).json({
      message: assistantResponse,
      success: true
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const commodityMarketData = async (req, res) => {
  try {
    const { commodity, state, startDate, endDate } = req.query;

    // Your prompt is well-structured and doesn't need changes.
    const prompt = ` 
You are an AI assistant that fetches Indian agricultural commodity prices from the Agmarknet portal and returns them as structured JSON.

Based on the following parameters:
- Commodity: ${commodity}
- State: ${state}
- Start Date: ${startDate}
- End Date: ${endDate}

Find all available market data. Format the output as a single JSON array where each object conforms to this exact structure:
{
  "date": "YYYY-MM-DD",
  "market_name": "string",
  "variety": "string",
  "min_price_per_quintal": integer,
  "max_price_per_quintal": integer,
  "modal_price_per_quintal": integer
}

Constraints:
- If no data is found for the given period, return an empty array [] otherwise array of objects having the above structure.
- All price fields must be integers. If a price is not available, use null.
- Do not include any text, notes, or explanations outside of the final JSON array.
`;
    const rawResponse = await callGemini(prompt, "gemini-2.0-flash");
    console.log("Raw Gemini Response:", rawResponse);

    // --- CORRECTION 1: Robust JSON Extraction & Parsing ---
    // This is a safety measure. It finds the string that starts with '[' and ends with ']'
    // to protect against the AI returning extra text or markdown like ```json ... ```
    const jsonStringMatch = rawResponse.match(/\[.*\]/s);

    if (!jsonStringMatch) {
      throw new Error("Valid JSON array not found in Gemini response.");
    }

    const marketData = JSON.parse(jsonStringMatch[0]);

    // --- CORRECTION 2: Final Response Structure ---
    // The response object now includes `success: true` as requested.
    res.status(200).json({
      success: true,
      data: marketData
    });

  } catch (error) {
    console.error("Commodity Market Data Error:", error);
    // The error response is also updated for consistency.
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

