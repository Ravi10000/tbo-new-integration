import { NextFunction, Response } from "express";
import { RequestTBO } from "../../middleware/tbo-auth";
import BookService from "./book.service";
import CustomError from "../../utils/CustomError";

class BookController {
    static async bookHotel(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO?.USERNAME || !req.TBO?.PASSWORD)
                throw new CustomError("TBO credentials required", 400);
            const { bookRS, error } = await BookService.bookHotel(req.body, req.TBO);
            if (error) throw new CustomError(error, 400);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'book response',
                result: {
                    contentType: "json",
                    serializerSettings: null,
                    statusCode: 200,
                    bookRS
                }
            });
        } catch (err) {
            console.log({ err });
            next(err);
        }
    }
}

export default BookController;