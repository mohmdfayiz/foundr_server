import { Router } from "express"
import { auth, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/user/mailController"
import * as usercontroller from "../controller/user/userController"
import * as chatController from "../controller/user/chatController"
import * as requestController from "../controller/user/connectionRequestController"
import * as articleController from "../controller/user/articleController"
import * as eventController from "../controller/user/eventController"

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
    .get(auth,usercontroller.matchingProfiles)

router
    .route('/getConnections')
    .get(auth, usercontroller.getConnections)

router
    .route('/getMessages')
    .get(auth, chatController.getMessage)

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
    .route('/updateUserDetails')
    .post(auth, usercontroller.updateUserDetails)

router
    .route('/sendMessage')
    .post(auth, chatController.sendMessage)

router
    .route('/connectionRequest')
    .post(auth,requestController.connectionRequest)
    .patch(requestController.updateConnectionRequst)


export default router;    
