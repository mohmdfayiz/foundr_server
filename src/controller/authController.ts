import { RequestHandler } from "express";
import userModel from "../models/userModel";

export const signup:RequestHandler = async(req,res)=>{
    try {
        const newUser = new userModel(req.body);
        newUser.save().then((newUser)=>{
            console.log(newUser);
            res.status(200).json('signup success');
        }).catch((error)=>{
            console.log(error)
            res.status(500).json(error)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json('Something went wrong')
    }
}