import mongoose from "mongoose";

export default function (connectionString:string) {
    mongoose.connect(connectionString)
        .then(() => {
            console.log("Database connected successfully")
        }).catch(console.error)
}