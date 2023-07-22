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
exports.updateUserStatus = exports.getUsers = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const userModel_1 = __importDefault(require("../../models/userModel"));
// GET ALL USERS
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.default.find().sort({ createdAt: -1 });
        if (!allUsers) {
            return next((0, http_errors_1.default)(404, 'Could not find users'));
        }
        res.status(200).send(allUsers);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getUsers = getUsers;
// BLOCK / UNBLOCK USER
const updateUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId)
            return next((0, http_errors_1.default)(400, 'user id not provided'));
        const user = yield userModel_1.default.findById(userId);
        if (!user)
            return next((0, http_errors_1.default)(404, 'Could not find user'));
        const status = user.status === 'Active' ? 'Blocked' : 'Active';
        yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $set: { status } });
        res.sendStatus(200);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateUserStatus = updateUserStatus;
