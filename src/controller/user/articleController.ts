import { RequestHandler } from "express"
import createHttpError,{InternalServerError} from "http-errors"
import articleModel from "../../models/articleModel"

// GET ALL ARTICLES
export const getArticles:RequestHandler = async (req,res,next) => {
    try {
        const articles = await articleModel.find({isHide:false}).sort({createdAt:-1})
        if(!articles) return next(createHttpError(404, 'Articles could not found'))
        res.status(200).send({articles})
    } catch (error) {
        return next(InternalServerError)
    }
}

// GET A SINGLE ARTICLE
export const getArticle:RequestHandler = async (req,res,next) => {
    try {
        const {articleId} = req.query;
        if(!articleId) return next(createHttpError(400,'Article required!'))
        const article = await articleModel.findById(articleId)
        res.status(200).send({article})
    } catch (error) {
        return next(InternalServerError)
    }
}