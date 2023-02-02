import { Document, model, Schema } from "mongoose";

export interface IArticle extends Document{
    title:string;
    content:string;
    coverImage:string;
}

const articleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
},
    { timestamps: true }
)

export default model<IArticle>('Article', articleSchema);
