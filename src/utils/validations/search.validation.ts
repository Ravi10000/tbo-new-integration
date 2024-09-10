import { body, param, query, FieldMessageFactory } from 'express-validator';
import moment from 'moment';

const isValidDate = (value: string) => {
    return moment(value, 'YYYY-MM-DD', true).isValid();
};

function check(key: string) {
    const [target, ...name] = key.split('');
    switch (target) {
        case '?': return query(name);
        case ':': return param(name);
        default: return body(key);
    }
}
// "rooms": [{ "guests": [{ "guestType": "ADT", "guestAge": 0 }] }],
export const searchValidation = [
    check('check_In').custom(isValidDate)
        .withMessage("invalid check in date, valid format YYYY-MM-DD"),
    check('check_Out').custom(isValidDate)
        .withMessage("invalid check out date, valid format YYYY-MM-DD"),
    check("authentication.companyId").notEmpty().withMessage("invalid authentication.companyId"),
    check("authentication.credentialId").notEmpty().withMessage("invalid authentication.credentialId"),
    check("authentication.credentialPassword").notEmpty().withMessage("invalid authentication.credentialPassword"),
    check("authentication.credentialType").notEmpty().withMessage("invalid authentication.credentialType"),
    check("destination.cityName").notEmpty().withMessage("invalid destination.cityName"),
    check("budgetAmountFrom").optional().isNumeric().withMessage("invalid budgetAmountFrom"),
    check("budgetAmountTo").optional().isNumeric().withMessage("invalid budgetAmountTo"),
    // check("StarRating").optional().isNumeric().withMessage("invalid StarRating"),
    check("rooms").notEmpty().withMessage("rooms required").isArray({ min: 1 }).withMessage("rooms must be an array with at least one room's details"),
    check("rooms.*.guests").notEmpty().withMessage("rooms must contain guests").isArray({ min: 1 }).withMessage("guests must be an array with at least one guest's details"),
    check("rooms.*.guests.*.guestType").notEmpty().withMessage("guest must have guestType"),
    check("rooms.*.guests.*.guestAge").notEmpty().withMessage("guest must have guestAge").isInt().withMessage("invalid guestAge, must be an integer"),
];