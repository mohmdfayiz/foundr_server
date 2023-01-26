import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "Active" },
},
    { timestamps: true }
)
type User = InferSchemaType<typeof userSchema>;
export default model<User>('User', userSchema);
