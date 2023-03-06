import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import eventModel from "../../models/eventModel";

// GET ALL EVENTS
export const getEvents: RequestHandler = async (req, res, next) => {
    try {
        const today = new Date();
        const events = await eventModel.find({dateAndTime:{$gte: today}}).sort({dateAndTime:1});
        if (!events) return next(createHttpError(404, 'Events could not find'));
        res.status(200).json({ events })
    } catch (error) {
        return next(InternalServerError)
    }
}

// GET A SINGLE EVENT
export const getEvent: RequestHandler = async (req,res,next) => {
    try {
        const {eventId} = req.query
        if(!eventId) return next(createHttpError(400,'Event id not provided'))
        const event = await eventModel.findById(eventId)
        console.log(event);
        res.status(200).json({event})
    } catch (error) {
        return next(InternalServerError)
    }
}

// JOIN TO EVENT AND SEND INVITATION MAIL 
export const joinEvent: RequestHandler = async (req, res, next) => {
    try {
        const { userId, userName, email } = res.locals.decodedToken
        if (!userId) return next(createHttpError(401, 'Unauthorized User'))
        const { eventId, joinLink } = req.body;
        await eventModel.findOneAndUpdate({ _id: eventId }, { $addToSet: { attendees: userId } });
        const subject = 'Event invitation';
        const content = 'invitation';
        const updatedBody = { ...req.body, userName, email, subject, joinLink, content }
        req.body = updatedBody;
        next()
    } catch (error) {
        return next(InternalServerError)
    }
}