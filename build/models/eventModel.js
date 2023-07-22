"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    mentorName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateAndTime: { type: Date, required: true },
    venue: { type: String, required: true },
    joinLink: { type: String, required: true },
    enrollmentFee: { type: Number, required: true },
    mentorImage: { type: String, required: true },
    attendees: { type: [mongoose_1.Types.ObjectId], ref: 'User' },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Event', eventSchema);
