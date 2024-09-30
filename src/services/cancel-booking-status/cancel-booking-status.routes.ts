import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import CancelBookingStatusController from "./cancel-booking-status.controller";
import { tboAuth } from "../../middleware/tbo-auth";
import { cancelBookingStatusValidations } from "../../utils/validations/cancel-booking-status.validation";
const router = Router();

router.post(
  "/cancel-booking-status",
  cancelBookingStatusValidations,
  validateRequest,
  tboAuth,
  CancelBookingStatusController.cancelBookingStatus
);

export default router;
