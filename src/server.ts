import "dotenv/config";
import env from "./util/validateEnv";
import database from "./config/connection";
import express  from "express";
import createHttpError from "http-errors";
import cors from 'cors'
import userRouter from "./routes/user"
import adminRoute from "./routes/admin"
import { errorHandler } from "./middleware/errorHandler";
import morgan from "morgan"


const app = express();
app.use(cors());

// fixing "413 Request Entity Too Large" errors
app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({limit: "5mb", extended: true, parameterLimit: 50000}))
app.use(morgan('dev'));

// api routes
app.use('/api/user', userRouter);
app.use('/api/admin',adminRoute)
app.use(()=>{
    throw createHttpError(404,'Route not found');
});
app.use(errorHandler);

const port = env.PORT;
database(env.MONGO_CONNECTION_STRING);
try{
    app.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}`);
    })
}catch(err){
    console.log(err);
}


