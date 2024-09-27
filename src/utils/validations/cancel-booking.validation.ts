import { authValidations } from "../../middleware/tbo-auth";
import { check } from "../validations.utils";

export const cancelBookingValidations = [
    ...authValidations,
];