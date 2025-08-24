import mongoose from "mongoose";

const RawChatHistorySchema = new mongoose.Schema({
    chathistory: {
        type: String,
    }
});

const RawChatHistory = mongoose.model("RawChatHistory", RawChatHistorySchema);

export default RawChatHistory;