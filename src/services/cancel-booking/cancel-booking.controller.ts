import { RequestTBO } from "../../middleware/tbo-auth";
import {
  Response, NextFunction
} from "express";
import CancelBookingService from "./cancel-booking.service";

class CancelBookingController {
  static async cancelBooking(req: RequestTBO, res: Response, next: NextFunction) {
    try {
      if (!req.TBO) throw new Error("invalid credentials")
      const { result, error } = await CancelBookingService.cancelBooking(req.body, req.TBO);
      if (error) throw new Error(error.message);
      return res.status(200).json(result);
    } catch (error) {
      console.log({ error });
      next(error);
    }
  }
}

export default CancelBookingController;
