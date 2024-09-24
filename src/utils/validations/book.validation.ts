import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

const guestPath = "roomDetails.*.roomTypes.roomRates.*.guests";

export const guestValidations = [
    check(guestPath)
        .notEmpty().withMessage("missing guest details")
        .isArray({ min: 1 }).withMessage("invalid guest details"),
    check(guestPath + ".title")
        .notEmpty().withMessage("missing guest title"),
    check(guestPath + ".firstName")
        .notEmpty().withMessage("missing guest first name"),
];

export const roomDetailsValidations = [
    check("roomDetails")
        .notEmpty().withMessage("missing room details")
        .isArray().withMessage("invalid room details, should be a list of room details"),
    check("roomDetails.*.roomTypes")
        .notEmpty().withMessage("missing room types"),
    check("roomDetails.*.roomTypes.roomTypeCode")
        .notEmpty().withMessage("missing room type code"),
    check("roomDetails.*.roomTypes.roomRates")
        .notEmpty().withMessage("missing room rates")
        .isArray().withMessage("invalid room rates, should be a list of room rates"),
];


export const bookValidations = [
    ...authValidations,
    ...roomDetailsValidations,
    ...guestValidations,
    check("hotelCode")
        .notEmpty().withMessage("missing hotel code"),
    check("searchId")
        .notEmpty().withMessage("missing search id"),
    check("netAmount").notEmpty().withMessage("missing net amount")
        .isNumeric().withMessage("net amount must be a number"),
];
