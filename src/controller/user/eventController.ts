import { RequestHandler } from "express";
import createHttpError,{InternalServerError} from "http-errors";
import eventModel from "../../models/eventModel";
import userModel from "../../models/userModel";
// import { sendMail } from "./mailController";

// GET ALL EVENTS
export const getEvents:RequestHandler = async (req,res,next) => {
    try {
        const events = await eventModel.find();
        if(!events) return next(createHttpError(404, 'Events could not find'));
        res.status(200).send({events})
    } catch (error) {
        return next(InternalServerError)
    }
}

// JOIN TO EVENT AND SEND INVITATION MAIL 
export const joinEvent:RequestHandler = async(req,res,next) => {
    try {
        const {userId} = res.locals.decodedToken 
        if(!userId) return next(createHttpError(401, 'Unauthorized User'))
        const {eventId} = req.body
        await eventModel.updateOne({_id:eventId}, {$push:{attendees:userId}})
        const user = await userModel.findById(userId)
        const userName = user?.userName
        const email = user?.email
        const subject = 'Event invitation'
        const content = 'Click the link below to join the room in Discord, See you there!'
        const updatedBody = {...req.body, userName, email, subject, content}
        req.body = updatedBody
        next()

    } catch (error) {
        return next(InternalServerError)
    }
}