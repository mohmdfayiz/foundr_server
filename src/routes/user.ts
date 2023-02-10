import { Router } from "express"
import * as usercontroller from "../controller/user/userController"
import { auth, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/user/mailController"
import * as chatController from "../controller/user/chatController"

const router = Router()


// GET METHODS
router
    .route('/verifyUser')
    .get(usercontroller.userExist);

router
    .route('/generateOtp')
    .get(localVariables,usercontroller.generateOtp);

router
    .route('/authenticate')
    .get(usercontroller.authenticate, (req,res) =>res.end());

router
    .route('/getConnections')
    .get(auth,usercontroller.getConnections)    

router
    .route('/getMessages')
    .get(auth,chatController.getMessage)    


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
    .route('/getUser')
    .get(auth,usercontroller.userDetails)    

router
    .route('/updateUserDetails')
    .post(auth, usercontroller.updateUserDetails)    

router
    .route('/sendMessage')
    .post(auth,chatController.sendMessage)    

router
    .route('/addConnection')
    .post(usercontroller.connection)

export default router;    
