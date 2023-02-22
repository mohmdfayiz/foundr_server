import { RequestHandler } from "express";
import createHttpError,{InternalServerError} from "http-errors";
import eventModel from "../../models/eventModel";
// import { sendMail } from "./mailController";

export const getEvents:RequestHandler = async (req,res,next) => {
    try {
        const events = await eventModel.find();
        if(!events) return next(createHttpError(404, 'Events could not find'));
        res.status(200).send({events})
    } catch (error) {
        return next(InternalServerError)
    }
}

export const joinEvent:RequestHandler = async(req,res,next) => {
    try {
        const {userId} = res.locals.decodedToken 
        if(!userId) return next(createHttpError(401, 'Unauthorized User'))
        const {eventId} = req.query

        await eventModel.updateOne({_id:eventId}, {$push:{attendees:userId}})
        res.sendStatus(201)

    } catch (error) {
        return next(InternalServerError)
    }
}