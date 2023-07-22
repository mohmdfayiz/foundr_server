import { NextFunction, Request, RequestHandler, Response } from 'express';
export declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const localVariables: RequestHandler;
