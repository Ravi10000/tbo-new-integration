import moment from 'moment';
import { check } from '../check.validation';

const isValidDate = (value: string) => {
    return moment(value, 'YYYY-MM-DD', true).isValid();
};

export const searchValidation = [
    check('Check_In').custom(isValidDate)
        .withMessage("invalid check in date, valid format YYYY-MM-DD"),
    check('Check_Out').custom(isValidDate)
        .withMessage("invalid check out date, valid format YYYY-MM-DD"),
    check("Authentication.CompanyId").notEmpty().withMessage("invalid Authentication.CompanyId"),
    check("Authentication.CredentialId").notEmpty().withMessage("invalid Authentication.CredentialId"),
    check("Authentication.CredentialPassword").notEmpty().withMessage("invalid Authentication.CredentialPassword"),
    check("Authentication.CredentialType").notEmpty().withMessage("invalid Authentication.CredentialType"),
    check("Destination.CityName").notEmpty().withMessage("invalid Destination.CityName"),
    check("BudgetAmountFrom").optional().isNumeric().withMessage("invalid BudgetAmountFrom"),
    check("BudgetAmountTo").optional().isNumeric().withMessage("invalid BudgetAmountTo"),
    // check("StarRating").optional().isNumeric().withMessage("invalid StarRating"),
    check("Rooms").notEmpty().withMessage("Rooms required").isArray({ min: 1 }).withMessage("Rooms must be an array with at least one room's details"),
    check("Rooms.*.Guests").notEmpty().withMessage("Rooms must contain Guests").isArray({ min: 1 }).withMessage("Guests must be an array with at least one guest's details"),
    check("Rooms.*.Guests.*.GuestType").notEmpty().withMessage("Guest must have GuestType"),
    check("Rooms.*.Guests.*.GuestAge").notEmpty().withMessage("Guest must have GuestAge").isInt().withMessage("invalid GuestAge, must be an integer"),
    check("Nationality").notEmpty().withMessage("Nationality Cannot be empty")
];