"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadNotification = exports.getNotifications = exports.createNotification = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const notificationModel_1 = __importDefault(require("../../models/notificationModel"));
// CREATE NOTIFICATION
const createNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const { type, receiver, reqFrom, message } = req.body;
        // create a document in notification for request/response
        const newNotification = new notificationModel_1.default({
            sender: userId,
            receiver: receiver || reqFrom,
            type,
            message
        });
        yield newNotification.save();
        res.sendStatus(201);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.createNotification = createNotification;
// GET NOTIFICATIONS
const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const notifications = yield notificationModel_1.default.find({ receiver: userId }).populate('sender').sort({ "createdAt": -1 });
        res.status(200).json({ notifications });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getNotifications = getNotifications;
// UPDATE NOTIFICATION AS READ
const updateReadNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const id = req.query.id;
        yield notificationModel_1.default.findOneAndUpdate({ _id: id }, { $set: { isRead: true } });
        res.sendStatus(200);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateReadNotification = updateReadNotification;
