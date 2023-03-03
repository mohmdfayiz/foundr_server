import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import eventModel from "../../models/eventModel";

// GET ALL EVENTS
export const getEvents: RequestHandler = async (req, res, next) => {
    try {
        const today = new Date();
        const events = await eventModel.find({dateAndTime:{$gte: today}});
        if (!events) return next(createHttpError(404, 'Events could not find'));
        res.status(200).send({ events })
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