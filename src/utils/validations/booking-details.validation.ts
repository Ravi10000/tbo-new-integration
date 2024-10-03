import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const bookingDetailsValidations = [
    ...authValidations,
    check("bookingReference").notEmpty().withMessage("booking reference is required")
]