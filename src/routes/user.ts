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
router
    .route('/verifyUser')
    .get(usercontroller.userExist);

router
    .route('/generateOtp')
    .get(localVariables, usercontroller.generateOtp);

router
    .route('/authenticate')
    .get(usercontroller.authenticate, (req, res) => res.end());

router
    .route('/getUser')
    .get(auth, usercontroller.userDetails)

router
    .route('/matchingProfiles')
    .get(auth, matchingProfile.findMatchingProfiles)

router
    .route('/getConnections')
    .get(auth, usercontroller.getConnections)

router
    .route('/getMessages')
    .get(auth, chatController.getMessage)

router
    .route('/getNotifications')
    .get(auth, notificationController.getNotifications)

router
    .route('/getRequests')
    .get(auth, requestController.getRequests)

router
    .route('/getArticles')
    .get(articleController.getArticles)

router
    .route('/getEvents')
    .get(eventController.getEvents)



// POST METHODS
router
    .route('/verifyOtp')
    .post(usercontroller.verifyOtp)

router
    .route('/sendMail')
    .post(sendMail)

router
    .route("/signup")
    .post(usercontroller.signup)

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
    .post(auth, requestController.updateConnectionRequst,notificationController.createNotification)


export default router;    
