import { RequestHandler } from "express"
import createHttpError,{InternalServerError} from "http-errors"
import articleModel from "../../models/articleModel"

// GET ALL ARTICLES
export const getArticles:RequestHandler = async (req,res,next) => {
    try {
        const articles = await articleModel.find()
        if(!articles) return next(createHttpError(404, 'Articles could not found'))
        res.status(200).send({articles})
    } catch (error) {
        return next(InternalServerError)
    }
}