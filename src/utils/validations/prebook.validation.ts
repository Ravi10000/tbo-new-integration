import { check } from "../validations.utils";

export const prebookValidations = [
    check("authentication").notEmpty().withMessage("missing authentication details"),
    check("authentication.companyId").notEmpty().withMessage("invalid authentication.companyId"),
    check("authentication.credentialId").notEmpty().withMessage("invalid authentication.credentialId"),
    check("authentication.credentialPassword").notEmpty().withMessage("invalid authentication.credentialPassword"),
    check("authentication.credentialType").notEmpty().withMessage("invalid authentication.credentialType"),
    check("hotelCode").notEmpty().withMessage("missing hotel code"),
    check("searchId").notEmpty().withMessage("missing search id"),
    check("roomDetails").notEmpty().withMessage("missing room details"),
]