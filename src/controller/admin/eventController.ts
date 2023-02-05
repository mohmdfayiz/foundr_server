import { RequestHandler } from "express";
import eventModel from "../../models/eventModel";
import createHttpError, {InternalServerError} from "http-errors";


// Get all the events
export const getEvents:RequestHandler = async (req,res,next) =>{
    try {
        const events = await eventModel.find()
        if (!events) return next(createHttpError(501, 'Could not retrieve data.'))
        res.status(200).send(events)
    } catch (error) {
        return next(InternalServerError)
    }
}

// Host a new Event
export const hostEvent:RequestHandler = async (req,res,next) => {
    
    try {
        const newEvent = new eventModel({
            mentorName:req.body.mentorName,
            title:req.body.title,
            description:req.body.description,
            dateAndTime:req.body.dateAndTime,
            venue:req.body.venue,
            mentorImage:req.body.montorImage
        })
        
        newEvent.save()
        .then((event)=>{
            console.log(event);
            res.sendStatus(201)
        })
        .catch(error => {
            console.log(error)
            return next(createHttpError(400,'Error occured!'))
        })

    } catch (error) {
        console.log(error);
        return next(InternalServerError)
    }
    
}