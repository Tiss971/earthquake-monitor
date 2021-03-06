const mongoose = require("mongoose")

// Create Schema
const MessageSchema = new mongoose.Schema({
    from: {
        type: mongoose.ObjectId,
        required: true,
    },
    to: {
        type: mongoose.ObjectId,
        required: true,
    },
    message: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Message = mongoose.model("messages", MessageSchema)
//mongoose.set("debug",true);
//User.ensureIndexes();

module.exports = Message
