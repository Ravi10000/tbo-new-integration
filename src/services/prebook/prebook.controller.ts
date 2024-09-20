import { Response, NextFunction } from "express"
import { RequestTBO } from '../../middleware/tbo-auth';
import PrebookService from "./prebook.service";
import CustomError from "../../utils/CustomError";

class PrebookController {
    static async prebook(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO) throw new CustomError("missing TBO credentials", 500);
            const availability = await PrebookService.prebook(req.body, req.TBO);
            res.status(200).json({
                status: "success",
                message: "prebook response",
                value: {
                    preBookRQ: req.body,
                    preBookRS: {
                        availabilityType: availability,
                    }
                }
            })
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

export default PrebookController;