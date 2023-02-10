import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import userModel from "../../models/userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";
import otpGenerator from 'otp-generator'


/* middleware for  user authentication */
export const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.method == "GET" ? req.query : req.body;
        const user = await userModel.findOne({ email });
        if (!user) return next(createHttpError(404, 'user not found'))
        next()
    } catch (error) {
        return next(InternalServerError)
    }
}

// check user already exist or not for signup
export const userExist: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.query;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send({ message: "Email already exists" });
        }
        return res.sendStatus(200) // user does not exist
    } catch (error) {
        return next(InternalServerError)
    }
}


// USER SIGN UP
export const signup: RequestHandler = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;

        const userExist = await userModel.findOne({ email });
        if (userExist) return next(createHttpError(422, 'Email already exist!'));

        await bcrypt.hash(password, 10).then((hashPassword) => {
            const newUser = new userModel({
                userName,
                email,
                password: hashPassword
            });
            newUser.save()
                .then(() => {
                    // create jwt token
                    const token = jwt.sign({
                        userId: newUser._id,
                        userName: newUser.userName
                    }, env.JWT_SECRET, { expiresIn: "24h" });

                    return res.status(201).send({
                        message: "Signup Successful...",
                        userId: newUser._id,
                        token,
                    })
                })
                .catch((error) => { res.status(500).json(error) })
        })

    } catch (error) {
        return next(InternalServerError)
    }
}

// USER SIGNIN
export const signin: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) return next(createHttpError(404, 'User not found!'));

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return next(createHttpError(401, 'Invalid password!'));

        // create jwt token
        const token = jwt.sign({
            userId: user._id,
            userName: user.userName
        }, env.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            message: "Login Successful...",
            userId: user._id,
            token
        })

    } catch (error) {
        return next(InternalServerError)
    }
}

// GET USER DETAILS
export const userDetails: RequestHandler = async (req, res, next) => {
    try {
        const { userId } = res.locals.decodedToken;
        if (!userId) return next(createHttpError(401, 'Invalid userId'));

        const user = await userModel.findById(userId);
        if (!user) return next(createHttpError(404, 'Could not find the user!'));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = Object.assign({}, user.toJSON()); // details except password 
        res.status(200).json(rest);

    } catch (error) {
        return next(InternalServerError);
    }
}

// UPDATE USER DETAILS
export const updateUserDetails: RequestHandler = async (req, res, next) => {
    try {

        const { userId } = res.locals.decodedToken;
        if (!userId) return next(createHttpError(401, 'Unauthorized user'))

        const { about, gender, age, country, state, city } = req.body
        await userModel.updateOne({ _id: userId }, { $set: { about, gender, age, location: { country, state, city } } })

    } catch (error) {
        return next(InternalServerError)
    }
}

// GET CONNCTIONS
export const getConnections: RequestHandler = async (req, res, next) => {
    try {
        const {userId} = res.locals.decodedToken
        if(!userId) return next(createHttpError(401, "unauthorized user"));
        
        const connectedUsers = await userModel.findById(userId).populate('connections').select({ connections: 1, _id: 0 })
        res.status(200).json(connectedUsers)
    } catch (error) {
        return next(InternalServerError)
    }
}


// ADD CONNECTION
export const connection: RequestHandler = async (req, res, next) => {
    try {

        // const userId = res.locals.decodedToken
        const user = req.query.user
        const userId = req.query.userId

        const newConnection = await userModel.findOneAndUpdate({ _id: userId }, { $push: { connections: user } })
        res.status(201).json(newConnection)

    } catch (error) {
        return next(InternalServerError)
    }
}


// export const updateUser: RequestHandler = async (req, res, next) => {
//     try {
//         const { userId } = res.locals.decodedToken;
//         if (userId) {
//             const { userName, email } = req.body;
//             await userModel.updateOne({ _id: userId }, { $set: { userName, email } }).then(() => {
//                 res.status(201).json('record updated successfully')
//             }).catch(() => next(createHttpError(501, 'Unable to update')))
//         } else {
//             return next(createHttpError(401, 'Unauthorized user'))
//         }
//     } catch (error) {
//         return next(InternalServerError)
//     }
// }

// GENERATE OTP
export const generateOtp: RequestHandler = async (req, res, next) => {
    try {
        req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        res.status(201).send({ code: req.app.locals.OTP })
    } catch (error) {
        return next(InternalServerError)
    }
}

// VERIFY OTP
export const verifyOtp: RequestHandler = async (req, res, next) => {
    const { code } = req.query;
    console.log(code);

    if (!code) return next(createHttpError(501, 'invalid OTP'))
    if ((req.app.locals.OTP) === code) {
        req.app.locals.OTP = null; // reset the otp value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(201).send({ msg: 'Verified Successfully.' })
    }
    return next(createHttpError(401, 'invalid OTP'))
}

// CHANGE PASSWORD
export const changePassword: RequestHandler = async (req, res, next) => {
    try {
        const { newPassword, email } = req.body;
        const password = await bcrypt.hash(newPassword, 10)

        await userModel.findOneAndUpdate({ email }, { $set: { password: password } }).then((result) => {
            if (!result) return res.sendStatus(404)
            res.sendStatus(202)
        })

    } catch (error) {
        return next(InternalServerError)
    }
}