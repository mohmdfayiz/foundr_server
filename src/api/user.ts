import {Router} from "express"
import * as authcontroller from "../controller/authController"

const router = Router()

router
    .route("/signup")
    .post(authcontroller.signup)



export default router;   
