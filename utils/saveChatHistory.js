import ChatHistory from "../models/chatHistory.js";

/**
 * Upsert a chat history record and add a message
 * @param {Object} params - Details for saving chat history
 * @returns {Object} chatSession
 */
export const saveChatHistory = async ({
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
}) => {
  // Find or create session
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

  // Save the session
  await chatSession.save();

  return chatSession;
};
