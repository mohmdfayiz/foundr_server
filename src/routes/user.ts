import { Router } from "express"
import * as usercontroller from "../controller/userController"
import { auth, userExist, verifyUser, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/mailController"

const router = Router()

router
    .route('/generateOtp')
    .get(userExist,localVariables,usercontroller.generateOtp)

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
    .route('/forgotPassword')
    .post(verifyUser,localVariables,usercontroller.generateOtp)    

router
    .route('/changePassword')
    .post(usercontroller.changePassword)    

router
    .route('/getUser')
    .get(usercontroller.userDetails)    

router
    .route('/updateUser')
    .post(auth, usercontroller.updateUser)

export default router;    
