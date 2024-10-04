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
    TOKEN_ID: string;
    TYPE: "TEST" | "LIVE"
}
// export async function tboAuth(req: RequestTBO, res: Response, next: NextFunction) {
//     try {
//         const creds = await TBOCredential.findOne({ companyId: req.body.authentication.companyId, type: req.body.authentication.credentialType });
//         if (!creds) throw new CustomError(`no TBO credentials found for given company id ${req.body?.authentication?.companyId}`, 403);
//         console.log({ creds });
//         req.TBO = {
//             USERNAME: creds.username,
//             PASSWORD: creds.password,
//             TYPE: req.body.authentication.credentialType
//         }
//         const isTokenValid = !creds.tokenValidTillDateTime
//             ? false
//             : !dayjs(creds.tokenValidTillDateTime).isBefore(dayjs().subtract(5, "minutes"));

//         console.log({ isTokenValid });

//         if (!isTokenValid) {
//             const { tokenId } = await getTBOAuthToken(creds.username, creds.password, req.TBO.TYPE);
//             if (!tokenId) throw new CustomError("error fetching TBO auth token", 500);
//             creds.tokenId = tokenId;
//             creds.tokenValidTillDateTime = dayjs().add(24, 'hours').subtract(10, 'minutes').toDate();
//             await creds.save();
//         }
//         req.TBO.TOKEN_ID = creds.tokenId;
//         next();
//     } catch (err) {
//         console.log({ err });
//         next(err);
//     }
// }

export async function tboAuth(req: RequestTBO, res: Response, next: NextFunction) {
    try {
        if (!req.get("x-token-id"))
            throw new CustomError("missing x-token-id header", 403);

        if (!req.get("x-username"))
            throw new CustomError("missing x-username header", 403);

        if (!req.get("x-password"))
            throw new CustomError("missing x-password header", 403);

        if (!req.get("x-credential-type"))
            throw new CustomError("missing x-credential-type header", 403);

        req.TBO = {
            TOKEN_ID: req.get("x-token-id") as string,
            USERNAME: req.get("x-username") as string,
            PASSWORD: req.get("x-password") as string,
            TYPE: req.get("x-credential-type") as "TEST" | "LIVE",
        }
        next();
    } catch (error) {
        next(error);
    }
}
export async function requireTokenId(req: RequestTBO, res: Response, next: NextFunction) {
    try {
        if (!req.TBO?.TOKEN_ID)
            throw new CustomError("missing x-token-id header", 401);
    } catch (error) {
        console.log({ error });
        next(error);
    }
}

export const authValidations = [
    check("authentication").notEmpty().withMessage("missing authentication details"),
    check("authentication.companyId").notEmpty().withMessage("invalid authentication.companyId"),
    check("authentication.credentialId").notEmpty().withMessage("invalid authentication.credentialId"),
    check("authentication.credentialPassword").notEmpty().withMessage("invalid authentication.credentialPassword"),
    check("authentication.credentialType").notEmpty().withMessage("invalid authentication.credentialType"),
]