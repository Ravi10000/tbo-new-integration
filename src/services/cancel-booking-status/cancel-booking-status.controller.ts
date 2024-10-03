import { RequestTBO } from "../../middleware/tbo-auth";
import {
  Response, NextFunction
} from "express";
import CancelBookingStatusService from "./cancel-booking-status.service";

class CancelBookingStatusController {
  static async cancelBookingStatus(req: RequestTBO, res: Response, next: NextFunction) {
    try {
      if (!req.TBO) throw new Error("invalid credentials")
      const { result, error } = await CancelBookingStatusService.cancelBookingStatus(req.body, req.TBO);
      if (error) throw new Error(error.message);
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Cancel Booking Status',
        result
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  }
}

export default CancelBookingStatusController;
