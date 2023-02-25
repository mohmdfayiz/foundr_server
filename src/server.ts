import "dotenv/config";
import env from "./util/validateEnv";
import database from "./config/connection";
import express from "express";
import http from "http"
import createHttpError from "http-errors";
import cors from 'cors'
import userRouter from "./routes/user"
import adminRoute from "./routes/admin"
import { errorHandler } from "./middleware/errorHandler";
import morgan from "morgan"
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
app.use(cors());

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))
app.use(morgan('dev'))

// api routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoute);
app.use(() => { throw createHttpError(404, 'Route not found') });
app.use(errorHandler);

const io = new Server(server, {
    cors: {
        origin: env.FRONT_END_URL,
        credentials: true
    }
})

// save online users with user id and socket id
const onlineUsers = new Map();
io.on("connection", (socket) => {

    // add user to onlineUsers if not already exist
    socket.on("addUser", (id) => { 
            onlineUsers.set(id, socket.id)
            console.log( id,'  connected to socket');
    })

    // send message to the client
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        console.log('message reached here ready to send to ', data.to);
        
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message)
            console.log(data.to, " -------------sent");
        }else{
            console.log('could not find socket of receiver');
        }
    })

    // socket.on('notification', (data) => {
    //     const sendUserSocket = onlineUsers.get(data.receiver)
    //     if (sendUserSocket) {
    //         socket.to(sendUserSocket).emit("notification-receive", data)
    //         console.log(sendUserSocket, "notification-receive");
    //     }
    // })

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

})

const port = env.PORT;
database(env.MONGO_CONNECTION_STRING);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})





