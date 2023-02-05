import { RequestHandler } from "express";
import createHttpError,{InternalServerError} from "http-errors";
import userModel from "../../models/userModel";

// GET ALL USERS
export const getUsers:RequestHandler = async(req,res,next) => {

    try {
        const allUsers = await userModel.find()
        if(!allUsers){ return next(createHttpError(404, 'Could not find users'))}
        res.status(200).send(allUsers)
    } catch (error) {
        return next(InternalServerError)
    }
}

