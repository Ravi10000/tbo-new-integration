import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { tboAuth } from "../../middleware/tbo-auth";
import VoucherController from "./voucher-booking.controller";
import { voucherBookingValidations } from "../../utils/validations/voucher-booking.validation";

const router = Router();

router.post("/generate-voucher", voucherBookingValidations, validateRequest, tboAuth, VoucherController.generateVoucher)
export default router;