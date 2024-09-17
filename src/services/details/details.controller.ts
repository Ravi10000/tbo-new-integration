import { Response, NextFunction } from 'express'
import { RequestTBO } from "../../middleware/inject-tbo-creds"
import DetailsService from './details.service';
import CustomError from '../../utils/CustomError';
class DetailsController {
    static async fetchHotelDetails(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO) throw new CustomError("Unauthorized", 403);
            const result = await DetailsService.getDetails(req.body, req.TBO);
            res.json({
                status: "success",
                result,
            })
        } catch (err) {
            next(err)
        }
    }
}

export default DetailsController;