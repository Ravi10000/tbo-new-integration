import { Router } from "express";
import { tboAuth } from "../../middleware/tbo-auth";
import BookingController from "./booking-details.controller";
import { bookingDetailsValidations } from "../../utils/validations/booking-details.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();
router.post("/booking-details", bookingDetailsValidations, validateRequest, tboAuth, BookingController.getBookingDetails);
export default router;