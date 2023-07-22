"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const connection_1 = __importDefault(require("./config/connection"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
// fixing "413 Request Entity Too Large" errors
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 100000 }));
app.use((0, morgan_1.default)('dev'));
// health check
app.get('/', (req, res) => { res.status(200).json({ message: 'OK' }); });
// api routes
app.use('/api/user', user_1.default);
app.use('/api/admin', admin_1.default);
app.use(() => { throw (0, http_errors_1.default)(404, 'Route not found'); });
app.use(errorHandler_1.errorHandler);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: validateEnv_1.default.FRONT_END_URL,
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Access',
            'Authorization'
        ]
    }
});
// save online users with user id and socket id
const onlineUsers = new Map();
io.on("connection", (socket) => {
    // add user to onlineUsers
    socket.on("addUser", (id) => {
        onlineUsers.set(id, socket.id);
    });
    // send message to the client
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const port = validateEnv_1.default.PORT || 5000;
(0, connection_1.default)(validateEnv_1.default.MONGO_CONNECTION_STRING).then(() => {
    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
