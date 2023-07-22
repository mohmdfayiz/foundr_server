"use strict";
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
exports.dashboardDetails = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const articleModel_1 = __importDefault(require("../../models/articleModel"));
const eventModel_1 = __importDefault(require("../../models/eventModel"));
const http_errors_1 = require("http-errors");
const dashboardDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const totalUsers = yield userModel_1.default.find({}).countDocuments();
        const publishedArticles = yield articleModel_1.default.find({ isHide: false }).countDocuments();
        const upcomingEvents = yield eventModel_1.default.find({ dateAndTime: { $gte: today } }).countDocuments();
        const chartData = yield eventModel_1.default.find({ dateAndTime: { $gte: today } });
        res.status(200).json({ totalUsers, publishedArticles, upcomingEvents, chartData });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.dashboardDetails = dashboardDetails;
