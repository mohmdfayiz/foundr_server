import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import articleModel from "../../models/articleModel";
import fileUploader from "../../util/fileUploader";

// Get all the articles
export const getArticles: RequestHandler = async (req, res, next) => {
    try {
        const articles = await articleModel.find();
        if (!articles) return next(createHttpError(501, 'Could not retrieve data.'))
        res.status(200).send(articles)
    } catch (error) {
        return next(InternalServerError)
    }
}

// Publish a new article
export const publishArticle: RequestHandler = async (req, res) => {

    const coverImage = await fileUploader(req.body.coverImage)
    const newArticle = new articleModel({
        title: req.body.title,
        content: req.body.content,
        coverImage
    })
    await newArticle.save()
        .then((article) => {
            console.log(article);
            res.sendStatus(201)
        })
        .catch((err) => console.log(err))
}