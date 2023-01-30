import { Document, model, Schema } from "mongoose";

export interface IUser extends Document{
    userName:string;
    email:string;
    password:string;
    status:string;
    isUserVerified:boolean;
}

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "Active" },
    isUserVerified:{type:Boolean, default:false}
},
    { timestamps: true }
)

export default model<IUser>('User', userSchema);
