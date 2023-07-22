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
exports.hostEvent = exports.getAttendies = exports.getEvents = void 0;
const eventModel_1 = __importDefault(require("../../models/eventModel"));
const http_errors_1 = __importStar(require("http-errors"));
const fileUploader_1 = __importDefault(require("../../util/fileUploader"));
// Get all events
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield eventModel_1.default.find().sort({ dateAndTime: -1 });
        if (!events)
            return next((0, http_errors_1.default)(501, 'Could not retrieve data.'));
        res.status(200).send(events);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getEvents = getEvents;
// GET ATTENDIES OF EVENT
const getAttendies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.query;
        const event = yield eventModel_1.default.findById(eventId, { attendees: 1 }).populate('attendees');
        const attendees = event === null || event === void 0 ? void 0 : event.attendees;
        res.status(200).json({ attendees });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getAttendies = getAttendies;
// Host a new Event
const hostEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorImage = yield (0, fileUploader_1.default)(req.body.mentorImage);
        const newEvent = new eventModel_1.default({
            mentorName: req.body.mentorName,
            title: req.body.title,
            description: req.body.description,
            dateAndTime: req.body.dateAndTime,
            venue: req.body.venue,
            joinLink: req.body.joinLink,
            enrollmentFee: req.body.enrollmentFee,
            mentorImage
        });
        yield newEvent.save()
            .then(() => {
            res.sendStatus(201);
        })
            .catch(() => {
            return next((0, http_errors_1.default)(400, 'Error occured!'));
        });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.hostEvent = hostEvent;
