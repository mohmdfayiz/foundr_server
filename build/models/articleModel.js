"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    isHide: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Article', articleSchema);
