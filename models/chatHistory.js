import mongoose from "mongoose";

const ChatHistorySchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    chat_history: {
        type: Array,
        default: [],
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: new Date().getFullYear() + 5
    },
    crop: {
        type: String,
        required: true,
        enum: [
            'wheat', 'rice', 'maize', 'cotton', 'sugarcane', 'pulses', 
            'oilseeds', 'vegetables', 'fruits', 'tea', 'coffee', 'spices',
            'other'
        ]
    },
    region: {
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        village: {
            type: String,
            required: false
        }
    },
    soil_quality: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0.5
    },
    rainfall: {
        type: Number,
        required: true,
        min: 0,
        max: 5000,
        unit: 'mm'
    },
    temperature: {
        type: Number,
        required: true,
        min: -20,
        max: 50,
        unit: '°C'
    },
    ndvi: {
        type: Number,
        required: false,
        min: 0,
        max: 1,
        default: null
    },
    yield: {
        value: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true,
            enum: ['kg/ha', 'quintals/acre', 'tons/ha', 'quintals/ha', 'kg/acre']
        }
    },
    season: {
        type: String,
        required: true,
        enum: ['kharif', 'rabi', 'zaid', 'spring', 'summer', 'winter', 'monsoon']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    user_message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
ChatHistorySchema.index({ user_id: 1, year: 1, crop: 1 });
ChatHistorySchema.index({ 'region.state': 1, 'region.district': 1 });
ChatHistorySchema.index({ created_at: -1 });

// Pre-save middleware to update the updated_at field
ChatHistorySchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

// Virtual for formatted yield display
ChatHistorySchema.virtual('yieldDisplay').get(function() {
    return `${this.yield.value} ${this.yield.unit}`;
});

// Method to add message to chat history
ChatHistorySchema.methods.addMessage = function(role, content, timestamp = new Date()) {
    this.chat_history.push({
        role: role, // 'user' or 'assistant'
        content: content,
        timestamp: timestamp
    });
    return this.save();
};

// Method to get recent messages
ChatHistorySchema.methods.getRecentMessages = function(limit = 10) {
    return this.chat_history.slice(-limit);
};

// Static method to find by user and year
ChatHistorySchema.statics.findByUserAndYear = function(userId, year) {
    return this.find({ user_id: userId, year: year });
};

// Static method to find by crop type
ChatHistorySchema.statics.findByCrop = function(crop) {
    return this.find({ crop: crop });
};

const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);

export default ChatHistory;
