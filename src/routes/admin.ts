import { Router } from "express"
import * as articleController from "../controller/admin/articleController"
import * as eventController from "../controller/admin/eventController"
import * as userController from "../controller/admin/userController"

const router = Router();

router
    .route('/getUsers')
    .get(userController.getUsers)

router
    .route('/getArticles')
    .get(articleController.getArticles);

router
    .route('/publishArticle')
    .post(articleController.publishArticle);
    
router
    .route('/getEvents')
    .get(eventController.getEvents);   
    
router
    .route('/hostEvent')
    .post(eventController.hostEvent);


export default router;   