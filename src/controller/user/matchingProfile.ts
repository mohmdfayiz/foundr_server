import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import userModel from "../../models/userModel";

export const findMatchingProfiles: RequestHandler = async (req, res, next) => {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId) return next(createHttpError(401, 'Unauthorized user'))

        const user = await userModel.findById(userId)
        if(!user) return next(createHttpError(404, 'could not find user'))

        const matchingProfiles = await userModel.find(
            { _id: { $ne: userId },
            $or:[
                {'cofounderResponsibilities':{$in:user.responsibilities}},
                {'responsibilities': {$in:user.cofounderResponsibilities}},
                {'cofounderHasIdea': user.cofounderHasIdea},
                {'interests':{$in:user.interests}},
                {$and:[{'location.country':user.location.country},{'locationPreference':user.locationPreference}]}
            ]
        })
        console.log(matchingProfiles);
        
    } catch (error) {
        return next(InternalServerError)
    }
}