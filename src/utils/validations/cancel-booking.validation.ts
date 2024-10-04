import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const cancelBookingValidations = [
    // ...authValidations,
    check("bookingReference").notEmpty().withMessage("booking reference is required"),
    // check("supplierId").notEmpty().withMessage("supplier Id is required")
];