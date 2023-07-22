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
exports.updateVisibility = exports.publishArticle = exports.getArticles = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const articleModel_1 = __importDefault(require("../../models/articleModel"));
const fileUploader_1 = __importDefault(require("../../util/fileUploader"));
// Get all the articles
const getArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield articleModel_1.default.find().sort({ createdAt: -1 });
        if (!articles)
            return next((0, http_errors_1.default)(501, 'Could not retrieve data.'));
        res.status(200).send(articles);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.getArticles = getArticles;
// Publish a new article
const publishArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coverImage = yield (0, fileUploader_1.default)(req.body.coverImage);
        const newArticle = new articleModel_1.default({
            title: req.body.title,
            content: req.body.content,
            coverImage
        });
        yield newArticle.save();
        res.sendStatus(201);
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, "Invalid input"));
    }
});
exports.publishArticle = publishArticle;
// UPDATE ARTICLE VISIBILITY
const updateVisibility = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.query;
        const article = yield articleModel_1.default.findById(articleId);
        const isHide = (article === null || article === void 0 ? void 0 : article.isHide) ? false : true;
        yield articleModel_1.default.findByIdAndUpdate(articleId, { $set: { isHide } });
        res.sendStatus(200);
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.updateVisibility = updateVisibility;
