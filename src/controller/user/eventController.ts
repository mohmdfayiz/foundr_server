import { RequestHandler } from "express";
import createHttpError,{InternalServerError} from "http-errors";
import eventModel from "../../models/eventModel";

export const getEvents:RequestHandler = async (req,res,next) => {
    try {
        const events = await eventModel.find();
        if(!events) return next(createHttpError(404, 'Events could not find'));
        res.status(200).send({events})
    } catch (error) {
        return next(InternalServerError)
    }
}