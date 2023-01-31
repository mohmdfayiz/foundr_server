import { Request, Response, Router } from "express"
import * as usercontroller from "../controller/userController"
import { auth, userVerify, localVariables } from "../middleware/authmiddleware"
import { sendMail } from "../controller/mailController"

const router = Router()

router.route('/').get((req: Request, res: Response) => { res.status(200).json('Welcome to the server of foundr.✨') })
router.route('/generateOtp').get(userVerify,localVariables,usercontroller.generateOtp)
router.route('/getUser').get(usercontroller.userDetails)

router.route('/sendMail').post(sendMail)
router.route('/verifyOtp').post(usercontroller.verifyOtp)
router.route("/signup").post(usercontroller.signup)
router.route("/signin").post(usercontroller.signin)
router.route('/updateUser').post(auth, usercontroller.updateUser)

export default router;    
