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
const authmiddleware_1 = require("../middleware/authmiddleware");
const mailController_1 = require("../controller/user/mailController");
const usercontroller = __importStar(require("../controller/user/userController"));
const chatController = __importStar(require("../controller/user/chatController"));
const requestController = __importStar(require("../controller/user/connectionRequestController"));
const articleController = __importStar(require("../controller/user/articleController"));
const eventController = __importStar(require("../controller/user/eventController"));
const matchingProfile = __importStar(require("../controller/user/matchingProfile"));
const notificationController = __importStar(require("../controller/user/notificationController"));
const router = (0, express_1.Router)();
// verify user existance before signup, if not exist => generate OTP
router
    .route('/verifyUser')
    .get(usercontroller.userExist, authmiddleware_1.localVariables, usercontroller.generateOtp);
// verify user existance before sendign OTP for change password
router
    .route('/authenticate')
    .get(usercontroller.authenticate, authmiddleware_1.localVariables, usercontroller.generateOtp);
// get all articles / single article => req.query.articleId
router
    .route('/getArticles')
    .get(articleController.getArticles);
// get all events / single event  => req.query.eventId
router
    .route('/getEvents')
    .get(eventController.getEvents);
// OTP verification
router
    .route('/verifyOtp')
    .post(usercontroller.verifyOtp);
// Send mail 
router
    .route('/sendMail')
    .post(mailController_1.sendMail);
// sign up => save details to database
router
    .route("/signup")
    .post(usercontroller.signup);
// sign in of user
router
    .route("/signin")
    .post(usercontroller.signin);
// change password
router
    .route('/changePassword')
    .post(usercontroller.changePassword);
// get logged user's details
router
    .route('/getUser')
    .get(authmiddleware_1.auth, usercontroller.userDetails);
// matching profiles    
router
    .route('/matchingProfiles')
    .get(authmiddleware_1.auth, matchingProfile.findMatchingProfiles);
// get connections of logged user
router
    .route('/getConnections')
    .get(authmiddleware_1.auth, requestController.getConnections);
// messages
router
    .route('/message')
    .get(authmiddleware_1.auth, chatController.getMessage)
    .post(authmiddleware_1.auth, chatController.sendMessage);
// get Notifications
router
    .route('/getNotifications')
    .get(authmiddleware_1.auth, notificationController.getNotifications);
// Connection Requests
router
    .route('/connectionRequest')
    .get(authmiddleware_1.auth, requestController.getRequests)
    .post(authmiddleware_1.auth, requestController.connectionRequest, notificationController.createNotification)
    .patch(authmiddleware_1.auth, requestController.updateConnectionRequst, notificationController.createNotification);
// join to a event
router
    .route('/joinEvent')
    .post(authmiddleware_1.auth, eventController.joinEvent, mailController_1.sendMail);
// profile photo
router
    .route('/profilePhoto')
    .get(authmiddleware_1.auth, usercontroller.getProfilePhoto)
    .post(authmiddleware_1.auth, usercontroller.profilePhoto);
// update user profile
router
    .route('/updateUserProfile')
    .post(authmiddleware_1.auth, usercontroller.updateUserProfile);
// update about user     
router
    .route('/updateAbout')
    .post(authmiddleware_1.auth, usercontroller.updateAbout);
// update cofounder preference    
router
    .route('/updateCofounderPreference')
    .post(authmiddleware_1.auth, usercontroller.updateCofounderPreference);
exports.default = router;
