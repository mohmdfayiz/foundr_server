import { RequestHandler } from "express";
import createHttpError, {InternalServerError} from "http-errors";
import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";
import otpGenerator from 'otp-generator'

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
            email: user.email,
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

// GET USER DETAILS
export const userDetails: RequestHandler = async (req,res,next)=>{
    try {
        if(!req.query.userId) return next(createHttpError(501, 'Invalid userId'));
        console.log(req.query.userId);
        
        const user = await userModel.findById(req.query.userId);
        if(!user) return next(createHttpError(404, 'Could not find the user!'));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password,...userDetails } = Object.assign({},user.toJSON()); // details except password 
        res.status(200).send(userDetails);
        
    } catch (error) {
        return next(InternalServerError);
    }
}

// UPDATE USER DETAILS
export const updateUser:RequestHandler = async (req,res,next) => {
    try {
        const { userId } = res.locals.decodedToken;
        if(userId){
            const {userName, email} = req.body;
            await userModel.updateOne({_id:userId},{$set:{userName,email}}).then(()=>{
                res.status(201).json('record updated successfully')
            }).catch(()=> next(createHttpError(501, 'Unable to update')) )
        }else{
            return next(createHttpError(401,'user not found'))
        }
    } catch (error) {
        return next(InternalServerError)
    }
}

// GENERATE NEW OTP
export const generateOtp:RequestHandler = async (req,res,next)=>{
    try {
        req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars:false });
        res.status(201).send({code:req.app.locals.OTP})
    } catch (error) {
        return next(InternalServerError)
    }
}

// VERIFY OTP
export const verifyOtp:RequestHandler = async (req,res,next) => {
    const code = (req.query.otp) ;
    if (!code) return next(createHttpError(501, 'invalid OTP'))
    if((req.app.locals.OTP) === code){
        req.app.locals.OTP = null; // reset the otp value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(201).send({msg:'Verified Successfully.'})
    }
    return next(createHttpError(501, 'invalid OTP'))
}