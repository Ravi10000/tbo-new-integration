import { Router } from "express";
import { cancelBookingValidations } from "../../utils/validations/cancel-booking.validation";
import { validateRequest } from "../../middleware/validateRequest";
import CancelBookingController from "./cancel-booking.controller";
import { tboAuth } from "../../middleware/tbo-auth";
const router = Router();

router.post(
  "/cancel-booking",
  cancelBookingValidations,
  validateRequest,
  tboAuth,
  CancelBookingController.cancelBooking
);

export default router;
