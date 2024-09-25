import { Router } from "express";
import { tboAuth } from "../../middleware/tbo-auth";
import BookingController from "./booking-details.controller";

const router = Router();
router.post("/booking-details", tboAuth, BookingController.getBookingDetails);
export default router;