import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError, { InternalServerError } from "http-errors";
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel';
import env from '../util/validateEnv'


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //   get the token from the authorization header
        if (!req.headers.authorization) return next(createHttpError(401, 'Invalid request!'))
        const token: string = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, env.JWT_SECRET);

        res.locals.decodedToken = decodedToken;
        next()

    } catch (error) {
        return next(InternalServerError)
    }
}

export const userExist = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.query;
    const userExist = await userModel.findOne({ email })
    if (userExist) {
        return next(createHttpError(422,'email already exist'))
    } else {
        next()
    }
}

export const verifyUser :RequestHandler = async (req,res,next)=>{
    try {
        const {email} = req.body;
        console.log(email);
        
        const userExist = await userModel.findOne({email});
        console.log(userExist);
        if(userExist){
            next()
        }else{
            return next(createHttpError(404,'User Not found'))
        }
    } catch (error) {
        return next(InternalServerError)
    }
}

export const localVariables: RequestHandler = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}

