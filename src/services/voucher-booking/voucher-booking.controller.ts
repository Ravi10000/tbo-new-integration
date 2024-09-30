import { NextFunction, Response } from "express";
import { RequestTBO } from "../../middleware/tbo-auth";
import VoucherBooking from "./voucher-booking.service";

class VoucherController {
    static async generateVoucher(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO) throw new Error("missing credentials");
            const { result, error } = await VoucherBooking.voucherBooking(req.body, req.TBO);
            if (error) throw new Error(error);
            return res.status(200).json(result);
        } catch (err: any) {
            console.log({ err });
            next(err);
        }
    }
}

export default VoucherController;