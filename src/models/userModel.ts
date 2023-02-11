import { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document{
    userName:string;
    email:string;
    password:string;
    status:string;
    gender:string;
    age:number;
    about:string;
    websiteUrl:string;
    location:{country:string, state:string, city:string};
    eduction:string;
    employment:string;
    cofounderPreferences:object;
    connections:[Types.ObjectId];
}

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    status: { type: String, default: "Active" },
    age:{type:Number},
    gender:String,
    about:String,
    websiteUrl:String,
    location:{
        country:String,
        state:String,
        city:String
    },
    education:String,
    employment:String,
    connections:[{type:Types.ObjectId, ref:'User'}]
},
    { timestamps: true }
)

export default model<IUser>('User', userSchema);
