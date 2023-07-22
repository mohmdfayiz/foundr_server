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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController = __importStar(require("../controller/admin/articleController"));
const eventController = __importStar(require("../controller/admin/eventController"));
const userController = __importStar(require("../controller/admin/userController"));
const dashboardController = __importStar(require("../controller/admin/dashboardController"));
const router = (0, express_1.Router)();
router
    .route('/dashboardDetails')
    .get(dashboardController.dashboardDetails);
router
    .route('/getUsers')
    .get(userController.getUsers);
router
    .route('/updateUserStatus')
    .patch(userController.updateUserStatus);
router
    .route('/getArticles')
    .get(articleController.getArticles);
router
    .route('/publishArticle')
    .post(articleController.publishArticle);
router
    .route('/updateArticleVisibility')
    .patch(articleController.updateVisibility);
router
    .route('/getEvents')
    .get(eventController.getEvents);
router
    .route('/getAttendies')
    .get(eventController.getAttendies);
router
    .route('/hostEvent')
    .post(eventController.hostEvent);
exports.default = router;
