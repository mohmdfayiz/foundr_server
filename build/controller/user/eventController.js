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
exports.joinEvent = exports.getEvents = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const eventModel_1 = __importDefault(require("../../models/eventModel"));
// GET EVENTS / SINGLE EVENT DETAILS
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const query = req.query.eventId ? { _id: req.query.eventId, dateAndTime: { $gte: today } } : { dateAndTime: { $gte: today } };
        const events = yield eventModel_1.default.find(query).sort({ dateAndTime: 1 });
        if (!events)
            return next((0, http_errors_1.default)(404, 'Events could not find'));
        res.status(200).json({ events });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getEvents = getEvents;
// JOIN TO EVENT AND SEND INVITATION MAIL 
const joinEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userName, email } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized User'));
        const { eventId, joinLink } = req.body;
        yield eventModel_1.default.findOneAndUpdate({ _id: eventId }, { $addToSet: { attendees: userId } });
        const subject = 'Event invitation';
        const content = 'invitation';
        const updatedBody = Object.assign(Object.assign({}, req.body), { userName, email, subject, joinLink, content });
        req.body = updatedBody;
        next();
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.joinEvent = joinEvent;
