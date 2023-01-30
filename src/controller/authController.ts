import { RequestHandler } from "express";
import createHttpError, {InternalServerError} from "http-errors";
import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";
// import otpGenerator from 'otp-generator'

// USER SIGN UP
export const signup: RequestHandler = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist)  return next(createHttpError(422, 'Email already exist!'));
       
        await bcrypt.hash(password, 10).then((hashPassword) => {
            const newUser = new userModel({
                userName,
                email, 
                password: hashPassword
            });
            newUser.save()
            .then(() => {res.status(201).json('signup success')})
            .catch((error) => {res.status(500).json(error)})
        })

    } catch (error) {
        return next(InternalServerError)
    }
}

// USER LOGIN
export const signin: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if(!user) return next(createHttpError(404, 'User not found!'));
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) return next(createHttpError(401, 'Invalid password!'));

        // create jwt token
        const token = jwt.sign({
            userId:user._id,
            userName: user.userName
        }, env.JWT_SECRET, {expiresIn:"24h"});

        return res.status(200).send({
            message:"Login Successful...",
            userName:user.userName,
            token
        })

    } catch (error) {
        return next(InternalServerError)
    }
}
 
// export const generateOtp:RequestHandler = async (req,res)=>{
    
// }