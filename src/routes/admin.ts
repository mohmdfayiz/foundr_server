import { Router } from "express"
import * as articleController from "../controller/admin/articleController"

const router = Router();

router
    .route('/publishArticle')
    .post(articleController.publishAricle)


export default router;   