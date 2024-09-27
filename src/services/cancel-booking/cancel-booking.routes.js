import { Router } from "express";
import { cancelBookingValidations } from "../../utils/validations/cancel-booking.validation";
const router = Router();

router.post(
  "/cancel-booking",
  cancelBookingValidations,
  validateReq,
  CancelBookingController.cancelBooking
);

export default router;
