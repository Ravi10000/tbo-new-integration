import { RequestTBO } from "../../middleware/tbo-auth";
import { Response, NextFunction } from "express";
import BookingDetailsService from "./booking-details.service";

class BookingController {
    static async getBookingDetails(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO) throw new Error("TBO Credentials is missing");
            const { bookingDetailsRS, error } = await BookingDetailsService.getBookingDetails(req.body, req.TBO);
            if (error) throw new Error(error);
            res.status(200).json({
                success: true,
                status: "success",
                message: "booking details fetched successfully",
                result: {
                    contentType: "json",
                    serializerSettings: null,
                    statusCode: 200,
                    bookingDetailsRS
                },
            });
        } catch (err) {
            console.log({ err });
            next(err);
        }
    }
}

export default BookingController;