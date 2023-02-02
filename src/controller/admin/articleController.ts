import { RequestHandler } from "express";
// import createHttpError, {InternalServerError} from "http-errors";
import articleModel from "../../models/articleModel";

export const publishAricle:RequestHandler = async(req,res) =>{

    console.log(req.body);
    const newArticle = new articleModel({
        title: req.body.title,
        content: req.body.content,
        coverImage: req.body.coverImage,
    })

    newArticle.save()
    .then((article)=>{
        console.log(article);
        res.sendStatus(201)
    })
    .catch((err)=> console.log(err))

}