import { tboAuthValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const prebookValidations = [
    ...tboAuthValidations,
    check("hotelCode").notEmpty().withMessage("missing hotel code"),
    check("searchId").notEmpty().withMessage("missing search id"),
    check("roomDetails").notEmpty().withMessage("missing room details"),
]