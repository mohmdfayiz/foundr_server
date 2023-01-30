// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken'
// import env from '../util/validateEnv'

// export const auth = async(request: Request, response: Response, next: NextFunction) => {
//     try {
//         //   get the token from the authorization header
//         const userToken:string = request.headers.authorization
//         const token:string = userToken.split(" ")[1];
//         const decodedToken = jwt.verify(token,env.JWT_SECRET);
//         const user = decodedToken;
//         // pass the the user down to the endpoints here
//         request.user = user;
//         // pass down functionality to the endpoint
//         next(); 
//     } catch (error) {
//         response.status(401).json({
//             error: new Error("Invalid request!"),
//         });
//     }
// }

