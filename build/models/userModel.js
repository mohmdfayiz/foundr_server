"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "Active" },
    age: { type: Number },
    gender: String,
    intro: String,
    profilePhoto: String,
    websiteUrl: String,
    location: {
        country: String,
        state: String,
        city: String
    },
    isTechnical: { type: Number },
    accomplishments: { type: String },
    haveIdea: { type: String },
    education: String,
    employment: String,
    responsibilities: [String],
    interests: [String],
    activelySeeking: { type: Number },
    cofounderTechnical: { type: Number },
    cofounderHasIdea: { type: Number },
    locationPreference: { type: Number },
    cofounderResponsibilities: [String],
    connections: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
