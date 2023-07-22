/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from "mongoose";
export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    status: string;
    gender: string;
    age: number;
    intro: string;
    websiteUrl: string;
    profilePhoto: string;
    location: {
        country: string;
        state: string;
        city: string;
    };
    eduction: string;
    employment: string;
    isTechnical: number;
    accomplishments: string;
    haveIdea: string;
    responsibilities: string[];
    interests: string[];
    activelySeeking: number;
    cofounderTechnical: number;
    cofounderHasIdea: number;
    locationPreference: number;
    cofounderResponsibilities: string[];
    connections: Types.ObjectId[];
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}, any>;
export default _default;
