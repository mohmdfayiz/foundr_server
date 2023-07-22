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
exports.updateConnectionRequst = exports.connectionRequest = exports.getRequests = exports.getConnections = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const connectionRequestModel_1 = __importDefault(require("../../models/connectionRequestModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
// GET CONNCTIONS
const getConnections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, "unauthorized user"));
        const connectedUsers = yield userModel_1.default.findById(userId).populate('connections').select({ connections: 1, _id: 0 });
        res.status(200).json(connectedUsers);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getConnections = getConnections;
// get all the incoming and sented connection requests
const getRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const connectionRequests = yield connectionRequestModel_1.default.find({ $or: [{ sender: userId }, { receiver: userId }] });
        res.status(200).send({ connectionRequests });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getRequests = getRequests;
// new connection request
const connectionRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, "Unauthorized user"));
        const { receiver } = req.body;
        // create a document in connection request model with default status 'pending'
        const newRequest = new connectionRequestModel_1.default({
            sender: userId,
            receiver: receiver,
        });
        yield newRequest.save();
        next(); // create notification
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.connectionRequest = connectionRequest;
// update the status of the request 
const updateConnectionRequst = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId)
            return next((0, http_errors_1.default)(401, 'Unauthorized user'));
        const { reqFrom, response } = req.body;
        // Update the status of the connection request based on response
        const status = response ? 'accepted' : 'rejected';
        const connectionRequest = yield connectionRequestModel_1.default.findOneAndUpdate({ receiver: userId, sender: reqFrom }, { $set: { status } });
        if (!connectionRequest) {
            return next((0, http_errors_1.default)(404, 'Request not found with the id'));
        }
        // If the request was accepted, add the sender and receiver to each other's connections array
        if (response) {
            yield userModel_1.default.findByIdAndUpdate(connectionRequest.sender, { $addToSet: { connections: connectionRequest.receiver } });
            yield userModel_1.default.findByIdAndUpdate(connectionRequest.receiver, { $addToSet: { connections: connectionRequest.sender } });
            next(); // create notificationl as accepted
        }
        else {
            next(); // create notification as rejected
        }
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateConnectionRequst = updateConnectionRequst;
