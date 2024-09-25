import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";
import { guestValidations, roomDetailsValidations } from "./book.validation";

export const prebookValidations = [
    ...authValidations,
    ...guestValidations,
    ...roomDetailsValidations,
    check("hotelCode")
        .notEmpty().withMessage("missing hotel code"),
    check("searchId")
        .notEmpty().withMessage("missing search id"),
]