const mongoose = require("mongoose")

const ThirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String,
        default: null,
    },
    provider_id: {
        type: String,
        default: null,
    },
    provider_data: {
        type: {},
        default: null,
    },
})

// Create Schema
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        image: {
            type: String,
        },
        third_party_auth: [ThirdPartyProviderSchema],
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: null,
            },
        },
        lastVisit: {
            type: Date,
            default: Date.now,
        },
    },
    { strict: false }
)

module.exports = User = mongoose.model("users", UserSchema)
