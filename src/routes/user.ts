import { Router } from "express"
import * as usercontroller from "../controller/user/userController"
import { auth, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/mailController"

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
    .route('/updateUser')
    .post(auth, usercontroller.updateUser)
    

export default router;    
