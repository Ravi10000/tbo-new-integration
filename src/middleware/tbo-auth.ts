import { NextFunction, Request, Response } from "express";
import TBOCredential from "../models/tbo-credential.model";
import CustomError from "../utils/CustomError";
import dayjs from "dayjs";
import { getTBOAuthToken } from "../core/auth.helper";
import { check } from "../utils/validations.utils";
export interface RequestTBO extends Request {
    TBO?: ITBOCreds;
}
export interface ITBOCreds {
    USERNAME: string;
    PASSWORD: string;
    TOKEN_ID?: string;
}
export async function tboAuth(req: RequestTBO, res: Response, next: NextFunction) {
    try {
        const creds = await TBOCredential.findOne({ companyId: req.body.authentication.companyId });
        if (!creds) throw new CustomError("no TBO credentials found for given company id", 403);
        console.log({ creds });
        req.TBO = {
            USERNAME: creds.username,
            PASSWORD: creds.password,
        }
        const isTokenValid = !creds.tokenValidTillDateTime
            ? false
            : !dayjs(creds.tokenValidTillDateTime).isBefore(dayjs().subtract(5, "minutes"));

        console.log({ isTokenValid });

        if (!isTokenValid) {
            const { tokenId } = await getTBOAuthToken(creds.username, creds.password);
            if (!tokenId) throw new CustomError("error fetching TBO auth token", 500);
            creds.tokenId = tokenId;
            creds.tokenValidTillDateTime = dayjs().add(24, 'hours').subtract(10, 'minutes').toDate();
            await creds.save();
        }
        req.TBO.TOKEN_ID = creds.tokenId;
        next();
    } catch (err) {
        console.log({ err })
    }
}

export const tboAuthValidations = [
    check("authentication").notEmpty().withMessage("missing authentication details"),
    check("authentication.companyId").notEmpty().withMessage("invalid authentication.companyId"),
    check("authentication.credentialId").notEmpty().withMessage("invalid authentication.credentialId"),
    check("authentication.credentialPassword").notEmpty().withMessage("invalid authentication.credentialPassword"),
    check("authentication.credentialType").notEmpty().withMessage("invalid authentication.credentialType"),
]