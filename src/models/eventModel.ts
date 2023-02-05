import { Document, model, Schema, Types } from "mongoose";

export interface Event extends Document{
    mentorName:string;
    title:string;
    description:string;
    dateAndTime:Date;
    venue:string;
    mentorImage:string;
    attendees:[Types.ObjectId];
    feedback:[{ userId:Types.ObjectId, feedback:string }]
}

const eventSchema = new Schema({
    mentorName:{ type:String, required:true },
    title:{ type:String, required:true },
    description:{ type:String, required:true },
    dateAndTime:{type:Date, required:true},
    venue:{type:String,required:true},
    mentorImage:{type:String, required:true},
    attendees:{ type:[Types.ObjectId], ref: 'User' },
    feedback:[{ userId:{type:Types.ObjectId, required:true}, feedback:String }]
},
    { timestamps: true }
)

export default model<Event>('Event', eventSchema);
