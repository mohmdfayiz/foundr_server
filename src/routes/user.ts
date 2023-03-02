import { Router } from "express"
import { auth, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/user/mailController"
import * as usercontroller from "../controller/user/userController"
import * as chatController from "../controller/user/chatController"
import * as requestController from "../controller/user/connectionRequestController"
import * as articleController from "../controller/user/articleController"
import * as eventController from "../controller/user/eventController"
import * as matchingProfile from '../controller/user/matchingProfile'
import * as notificationController from "../controller/user/notificationController"

const router = Router()


// GET METHODS

// verify user existance before signup, if not exist => generate OTP
router
    .route('/verifyUser')
    .get(usercontroller.userExist, localVariables, usercontroller.generateOtp);

// verify user existance before sendign OTP for change password
router
    .route('/authenticate')
    .get(usercontroller.authenticate, localVariables, usercontroller.generateOtp);

// get logged user's details
router
    .route('/getUser')
    .get(auth, usercontroller.userDetails)

// matching profiles    
router
    .route('/matchingProfiles')
    .get(auth, matchingProfile.findMatchingProfiles)

// get connections of logged user
router
    .route('/getConnections')
    .get(auth, usercontroller.getConnections)

// get chat between logged user and selected user
router
    .route('/getMessages')
    .get(auth, chatController.getMessage)

// get Notifications
router
    .route('/getNotifications')
    .get(auth, notificationController.getNotifications)

// Connection Requests including sent and received
router
    .route('/getRequests')
    .get(auth, requestController.getRequests)

// get all articles
router
    .route('/getArticles')
    .get(articleController.getArticles)

// get all events
router
    .route('/getEvents')
    .get(eventController.getEvents)



// POST METHODS

// OTP verification
router
    .route('/verifyOtp')
    .post(usercontroller.verifyOtp)

// Send mail 
router
    .route('/sendMail')
    .post(sendMail)

// sign up => save details to database
router
    .route("/signup")
    .post(usercontroller.signup)

// sign in of user
router
    .route("/signin")
    .post(usercontroller.signin)


router
    .route('/changePassword')
    .post(usercontroller.changePassword)

router
    .route('/joinEvent')
    .post(auth, eventController.joinEvent, sendMail)

router
    .route('/profilePhoto')
    .post(auth, usercontroller.profilePhoto)

router
    .route('/updateUserProfile')
    .post(auth, usercontroller.updateUserProfile)

router
    .route('/updateAbout')
    .post(auth, usercontroller.updateAbout)

router
    .route('/updateCofounderPreference')
    .post(auth, usercontroller.updateCofounderPreference)

router
    .route('/sendMessage')
    .post(auth, chatController.sendMessage)

router
    .route('/connectionRequest')
    .post(auth, requestController.connectionRequest, notificationController.createNotification)

router
    .route('/updateConnectionResponse')
    .post(auth, requestController.updateConnectionRequst, notificationController.createNotification)


export default router;    
