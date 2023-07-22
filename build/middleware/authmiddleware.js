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
exports.localVariables = exports.auth = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   get the token from the authorization header
        if (!req.headers.authorization)
            return next((0, http_errors_1.default)(401, 'Invalid request!'));
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(JSON.parse(token), validateEnv_1.default.JWT_SECRET);
        res.locals.decodedToken = decodedToken;
        next();
    }
    catch (error) {
        return next((0, http_errors_1.default)(401, 'Invalid token'));
    }
});
exports.auth = auth;
const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
};
exports.localVariables = localVariables;
