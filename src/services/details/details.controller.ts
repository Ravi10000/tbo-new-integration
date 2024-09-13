import { Response, NextFunction } from 'express'
import { RequestTBO } from "../../middleware/inject-tbo-creds"
class DetailsController {
    static async fetchHotelDetails(req: RequestTBO, res: Response, next: NextFunction) {
        res.json({
            status: "success"
        })
    }
}

export default DetailsController;