import { Response, NextFunction } from 'express'
import { RequestTBO } from "../../middleware/tbo-auth"
import DetailsService from './details.service';
import CustomError from '../../utils/CustomError';
class DetailsController {
    static async fetchHotelDetails(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO) throw new CustomError("Unauthorized", 403);
            const hotelDetailsRS = await DetailsService.getDetails(req.body, req.TBO);
            res.json({
                success: true,
                status: "success",
                message: "hotel details fetched successfully",
                result: {
                    contentType: "json",
                    serializerSettings: null,
                    statusCode: 200,
                    hotelDetailsRS
                },
            })
        } catch (err) {
            next(err)
        }
    }
}

export default DetailsController;