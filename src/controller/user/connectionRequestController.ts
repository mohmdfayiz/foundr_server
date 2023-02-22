import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import connectionRequestModel from "../../models/connectionRequestModel";
import notificationModel from "../../models/notificationModel";
import userModel from "../../models/userModel";

export const requestNotification:RequestHandler = async(req,res,next) => {
    try {
        const {userId} = res.locals.decodedToken
        if(!userId) return next(createHttpError(401, 'Unauthorized user'))
        const {receiver, title, message} = req.body

        const newNotification = new notificationModel({
            sender:userId,
            receiver,
            title,
            message
        })

        await newNotification.save();
        res.sendStatus(201)

    } catch (error) {
        return next(InternalServerError)
    }
};

export const connectionRequest: RequestHandler = async (req, res, next) => {
    try {

        const { userId } = res.locals.decodedToken
        if (!userId) return next(createHttpError(401, "Unauthorized user"));
        const { to } = req.query
    
        const newRequest = new connectionRequestModel({
            sender: userId,
            receiver: to,
        })

        await newRequest.save()        
        res.sendStatus(201)

    } catch (error) {
        return next(InternalServerError)
    }
}

export const updateConnectionRequst: RequestHandler = async (req, res, next) => {
    try {

        const { requestId, accept } = req.body
        console.log(req.body);
        
        // Find the friend request
        const connectionRequest = await connectionRequestModel.findById(requestId);
        if (!connectionRequest) {
            return next(createHttpError(404, 'Request not found with the requestId'))
        }

        // Update the status of the friend request
        connectionRequest.status = accept ? 'accepted' : 'rejected';
        await connectionRequest.save();

        // If the request was accepted, add the sender and receiver to each other's connections
        if (accept) {
            await userModel.findByIdAndUpdate(connectionRequest.sender, {$push:{connections:connectionRequest.receiver}});
            await userModel.findByIdAndUpdate(connectionRequest.receiver,{$push:{connections:connectionRequest.sender}});
            return res.status(201).json('Connection successful')
        }

        res.sendStatus(201)

    } catch (error) {
        return next(InternalServerError)
    }
}