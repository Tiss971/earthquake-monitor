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
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
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
            default: undefined,
        },
        coordinates: {
            type: [Number],
            default: undefined,
        },
    },
    address: {
        type: String,
    },
    public: {
        type: Boolean,
    },
    lastVisit: {
        type: Date,
        default: Date.now,
    },
})

try {
    UserSchema.index(
        { username: 1, "third_party_auth.provider_name": 1 },
        { unique: true }
    )
} catch (err) {
    console.log(err)
}

const User = mongoose.model("users", UserSchema)
//mongoose.set("debug",true);
//User.ensureIndexes();

module.exports = User
