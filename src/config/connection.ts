import mongoose from "mongoose";

export default async function (connectionString:string) {
    mongoose.set("strictQuery", true);
    await mongoose.connect(connectionString)
        .then(() => {
            console.log("Database connected successfully")
        }).catch(console.error)
}