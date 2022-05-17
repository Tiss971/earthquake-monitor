const mongoose = require("mongoose")

// Create Schema
const OnlineUsersSchema = new mongoose.Schema(
    {
        socketId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        }
    }
)

const OnlineUser = mongoose.model("onlineUser", OnlineUsersSchema)

module.exports = OnlineUser
