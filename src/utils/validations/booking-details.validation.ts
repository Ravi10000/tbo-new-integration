import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const bookingDetailsValidations = [
    ...authValidations,
    check("bookingId").notEmpty().withMessage("booking Id is required")
]