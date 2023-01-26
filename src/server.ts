import "dotenv/config";
import env from "./util/validateEnv";
import database from "./config/connection";
import express  from "express";
import userRouter from "./api/user"

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);

const port = env.PORT;
database(env.MONGO_CONNECTION_STRING);
try{
    app.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}`); 
    })
}catch(err){
    console.log(err);
}



