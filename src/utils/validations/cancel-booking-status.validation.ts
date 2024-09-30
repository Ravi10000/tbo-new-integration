import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const cancelBookingStatusValidations = [
    ...authValidations,
    check("requestId").notEmpty().withMessage("request id is required"),
    // check("supplierId").notEmpty().withMessage("supplier Id is required")
];