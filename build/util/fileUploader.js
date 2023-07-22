"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const validateEnv_1 = __importDefault(require("./validateEnv"));
const cloud_name = validateEnv_1.default.CLOUD_NAME;
const api_key = validateEnv_1.default.API_KEY;
const api_secret = validateEnv_1.default.API_SECRET;
cloudinary_1.v2.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};
exports.default = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            else if (error) {
                return reject({ message: error.message });
            }
        });
    });
};
