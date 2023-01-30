import {Request, Response, Router} from "express"
import * as authcontroller from "../controller/authController"

const router = Router()
router.route('/').get((req:Request,res:Response)=>{res.status(200).json('Welcome to the server of foundr.✨')})
router.route("/signup").post(authcontroller.signup)
router.route("/signin").post(authcontroller.signin)

export default router;    
