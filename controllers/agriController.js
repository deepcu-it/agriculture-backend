import { callGemini } from "../utils/callGemini.js";
import { saveChatHistory } from "../utils/saveChatHistory.js";
import axios from "axios";

// 1. AgriCopilot - Multilingual Farming Assistant
export const agriCopilot = async (req, res) => {
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

    // Validate required fields
    if (!user_id || !session_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, session_id, and user_message are required"
      });
    }

    // Construct multilingual farming assistant prompt
    const prompt = `You are an expert agricultural assistant that can communicate in multiple languages. 
    
IMPORTANT: Detect the language of the user's message and respond in the SAME language. If the user writes in Hindi, Tamil, Bengali, or any other language, respond in that exact language.

Context: You are helping a farmer with agricultural guidance. Provide practical, actionable advice in approximately 150 words.

Farmer's Details:
- Year: ${year || new Date().getFullYear()}
- Crop: ${crop || 'Not specified'}
- Region: ${region ? `${region.state}, ${region.district}` : 'Not specified'}
- Soil Quality: ${soil_quality || 'Not specified'}
- Rainfall: ${rainfall || 'Not specified'} mm
- Temperature: ${temperature || 'Not specified'}°C
- NDVI: ${ndvi || 'Not specified'}
- Yield: ${yieldData ? `${yieldData.value} ${yieldData.unit}` : 'Not specified'}
- Season: ${season || 'Not specified'}

User Question: ${user_message}

Instructions:
1. Detect the language of the user's message
2. Respond in the SAME language
3. Provide practical farming advice based on the context
4. Keep response around 150 words
5. Be encouraging and supportive
6. Include specific recommendations for their situation`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history
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
      success: true,
      message: assistantResponse,
      session_id: chatSession.session_id,
      chat_history_id: chatSession._id,
      type: "agri_copilot"
    });

  } catch (error) {
    console.error("AgriCopilot Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// 2. AgriVision - Smart Yield Predictor & Storytelling
export const agriVision = async (req, res) => {
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

    // Validate required fields
    if (!user_id || !session_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, session_id, and user_message are required"
      });
    }

    // Construct yield prediction and storytelling prompt
    const prompt = `You are AgriVision, a smart yield predictor and agricultural storyteller. 
    
Your task is to turn raw agricultural data into an engaging, farmer-friendly narrative that explains yield trends, risks, and predictions in natural language.

Context: You are analyzing agricultural data to provide insights and predictions.

Farmer's Data:
- Year: ${year || new Date().getFullYear()}
- Crop: ${crop || 'Not specified'}
- Region: ${region ? `${region.state}, ${region.district}` : 'Not specified'}
- Soil Quality: ${soil_quality || 'Not specified'} (0-1 scale)
- Rainfall: ${rainfall || 'Not specified'} mm
- Temperature: ${temperature || 'Not specified'}°C
- NDVI: ${ndvi || 'Not specified'}
- Yield: ${yieldData ? `${yieldData.value} ${yieldData.unit}` : 'Not specified'}
- Season: ${season || 'Not specified'}

User Question: ${user_message}

Instructions:
1. Analyze the data to predict yield potential
2. Identify risks and opportunities
3. Convert technical data into engaging stories
4. Use natural language instead of technical jargon
5. Example: Instead of "rainfall is 1200mm", say "This year, your rice crop looks strong because rainfall is above average, but monitor pest attacks"
6. Keep response around 150 words
7. Be optimistic but realistic
8. Include specific actionable insights`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history
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
      success: true,
      message: assistantResponse,
      session_id: chatSession.session_id,
      chat_history_id: chatSession._id,
      type: "agri_vision"
    });

  } catch (error) {
    console.error("AgriVision Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// 3. CropGPT - Market & Price Insights
export const cropGPT = async (req, res) => {
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

    // Validate required fields
    if (!user_id || !session_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, session_id, and user_message are required"
      });
    }

    // Construct market and price insights prompt
    const prompt = `You are CropGPT, an expert in agricultural market analysis and crop profitability insights.
    
Your role is to help farmers choose the most profitable crops based on their local conditions and market trends.

Context: You are analyzing crop yield potential and market profitability for a farmer.

Farmer's Data:
- Year: ${year || new Date().getFullYear()}
- Current Crop: ${crop || 'Not specified'}
- Region: ${region ? `${region.state}, ${region.district}` : 'Not specified'}
- Soil Quality: ${soil_quality || 'Not specified'} (0-1 scale)
- Rainfall: ${rainfall || 'Not specified'} mm
- Temperature: ${temperature || 'Not specified'}°C
- NDVI: ${ndvi || 'Not specified'}
- Current Yield: ${yieldData ? `${yieldData.value} ${yieldData.unit}` : 'Not specified'}
- Season: ${season || 'Not specified'}

User Question: ${user_message}

Instructions:
1. Analyze the farmer's current conditions (soil, climate, region)
2. Recommend alternative crops with comparative profitability
3. Consider market demand and price trends
4. Explain insights in simple, farmer-friendly language
5. Help farmers reduce risks and diversify income
6. Stay aligned with local soil and climate conditions
7. Include specific crop recommendations with reasoning
8. Keep response around 150 words
9. Be practical and actionable`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history
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
      success: true,
      message: assistantResponse,
      session_id: chatSession.session_id,
      chat_history_id: chatSession._id,
      type: "crop_gpt"
    });

  } catch (error) {
    console.error("CropGPT Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// 4. Eco-AI - Climate Impact Analyzer
export const ecoAI = async (req, res) => {
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

    // Validate required fields
    if (!user_id || !session_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, session_id, and user_message are required"
      });
    }

    // Construct climate impact analysis prompt
    const prompt = `You are Eco-AI, a climate impact analyzer helping farmers make sustainable agricultural decisions.
    
Your mission is to analyze the environmental impact of farming practices and promote eco-friendly solutions while maintaining profitability.

Context: You are evaluating the environmental sustainability of agricultural practices.

Farmer's Data:
- Year: ${year || new Date().getFullYear()}
- Crop: ${crop || 'Not specified'}
- Region: ${region ? `${region.state}, ${region.district}` : 'Not specified'}
- Soil Quality: ${soil_quality || 'Not specified'} (0-1 scale)
- Rainfall: ${rainfall || 'Not specified'} mm
- Temperature: ${temperature || 'Not specified'}°C
- NDVI: ${ndvi || 'Not specified'}
- Yield: ${yieldData ? `${yieldData.value} ${yieldData.unit}` : 'Not specified'}
- Season: ${season || 'Not specified'}

User Question: ${user_message}

Instructions:
1. Analyze the environmental impact of current farming practices
2. Compare alternatives for sustainability (water usage, carbon footprint, soil health)
3. Provide specific examples: "Growing maize instead of rice saves 20% water and lowers carbon footprint"
4. Balance environmental benefits with profitability and yield
5. Promote eco-friendly farming practices
6. Consider resource efficiency and climate impact
7. Provide actionable recommendations for sustainable farming
8. Keep response around 150 words
9. Focus on practical sustainability solutions`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history
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
      success: true,
      message: assistantResponse,
      session_id: chatSession.session_id,
      chat_history_id: chatSession._id,
      type: "eco_ai"
    });

  } catch (error) {
    console.error("Eco-AI Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// 5. AgriChat - Creative Brainstorming Mode
export const agriChat = async (req, res) => {
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

    // Validate required fields
    if (!user_id || !session_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, session_id, and user_message are required"
      });
    }

    // Construct creative brainstorming prompt
    const prompt = `You are AgriChat, a creative brainstorming partner for agricultural innovation and experimentation.
    
Unlike other AI assistants that focus on predictions and analytics, you are designed to spark creativity, encourage experimentation, and foster farmer innovation.

Context: You are helping farmers explore unconventional but potentially rewarding agricultural strategies.

Farmer's Data:
- Year: ${year || new Date().getFullYear()}
- Current Crop: ${crop || 'Not specified'}
- Region: ${region ? `${region.state}, ${region.district}` : 'Not specified'}
- Soil Quality: ${soil_quality || 'Not specified'} (0-1 scale)
- Rainfall: ${rainfall || 'Not specified'} mm
- Temperature: ${temperature || 'Not specified'}°C
- NDVI: ${ndvi || 'Not specified'}
- Yield: ${yieldData ? `${yieldData.value} ${yieldData.unit}` : 'Not specified'}
- Season: ${season || 'Not specified'}

User Question: ${user_message}

Instructions:
1. Encourage creative thinking and "what if" scenarios
2. Analyze feasibility, risks, and benefits of unconventional approaches
3. Suggest innovative farming solutions (intercropping, alternative irrigation, etc.)
4. Explore experimental agricultural strategies
5. Be supportive of farmer innovation and experimentation
6. Provide practical guidance for trying new approaches
7. Consider intercropping techniques, irrigation methods, and sustainable practices
8. Keep response around 150 words
9. Focus on sparking creativity and encouraging experimentation`;

    // Get Gemini response
    const assistantResponse = await callGemini(prompt);

    // Save chat history
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
      success: true,
      message: assistantResponse,
      session_id: chatSession.session_id,
      chat_history_id: chatSession._id,
      type: "agri_chat"
    });

  } catch (error) {
    console.error("AgriChat Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export const getWeatherData = async (req, res) => {
    try {
      // do by region
      const { region } = req.query;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${process.env.OPEN_WEATHER_API_KEY}`);
      res.status(200).json({
        success: true,
        message: response.data
      });
    }catch(error){
      console.error("getWeatherData Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Internal server error" 
      });
    }

}