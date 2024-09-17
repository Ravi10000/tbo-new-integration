// import moment from 'moment';
import { tboAuthValidations } from '../../middleware/tbo-auth';
import { check, isValidDate } from '../validations.utils';

export const searchValidation = [
    ...tboAuthValidations,
    check('checkIn').custom(isValidDate)
        .withMessage("invalid check in date, valid format YYYY-MM-DD"),
    check('checkOut').custom(isValidDate)
        .withMessage("invalid check out date, valid format YYYY-MM-DD"),
    check("destination.cityName").notEmpty().withMessage("invalid destination.cityName"),
    check("budgetAmountFrom").optional().isNumeric().withMessage("invalid budgetAmountFrom"),
    check("budgetAmountTo").optional().isNumeric().withMessage("invalid budgetAmountTo"),
    // check("starRating").optional().isNumeric().withMessage("invalid starRating, should be a valid integer"),
    check("rooms").notEmpty().withMessage("rooms required").isArray({ min: 1 }).withMessage("rooms must be an array with at least one room's details"),
    check("rooms.*.guests").notEmpty().withMessage("rooms must contain Guests").isArray({ min: 1 }).withMessage("guests must be an array with at least one guest's details"),
    check("rooms.*.guests.*.guestType").notEmpty().withMessage("guest must have guestType"),
    check("rooms.*.guests.*.guestAge").notEmpty().withMessage("guest must have guestAge").isInt().withMessage("invalid guestAge, must be an integer"),
    check("nationality").notEmpty().withMessage("nationality Cannot be empty")
];