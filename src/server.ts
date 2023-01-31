import "dotenv/config";
import env from "./util/validateEnv";
import database from "./config/connection";
import express  from "express";
import createHttpError from "http-errors";
import cors from 'cors'
import userRouter from "./routes/user"
import { errorHandler } from "./middleware/errorHandler";
import morgan from "morgan"

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// api routes
app.use('/api/user', userRouter);
app.use(()=>{
    throw createHttpError(404,'Route not found');
});
app.use(errorHandler);

const port = env.PORT;
database(env.MONGO_CONNECTION_STRING);
try{
    app.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}/api/user`); 
    })
}catch(err){
    console.log(err);
}


