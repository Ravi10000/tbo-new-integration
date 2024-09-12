import { NextFunction, Request, Response } from "express";

export interface RequestTBO extends Request {
    TBO?: TBOCreds;
}
export interface TBOCreds {
    USERNAME: string;
    PASSWORD: string;
}
export function injectTBOCredentials(req: RequestTBO, res: Response, next: NextFunction) {
    try {
        if (!process.env.TBO_USERNAME || !process.env.TBO_PASSWORD)
            throw new Error("TBO_USERNAME and TBO_PASSWORD must be specified")

        req.TBO = {
            USERNAME: process.env.TBO_USERNAME,
            PASSWORD: process.env.TBO_PASSWORD,
        }
        next();
    } catch (err) {
        console.log({ err })
    }
}