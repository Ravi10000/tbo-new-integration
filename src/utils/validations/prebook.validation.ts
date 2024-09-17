import { tboAuthValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const prebookValidations = [
    ...tboAuthValidations,
    check("hotelCode")
        .notEmpty().withMessage("missing hotel code"),
    check("searchId")
        .notEmpty().withMessage("missing search id"),
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

]