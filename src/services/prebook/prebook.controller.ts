import { Response, NextFunction } from "express"
import { RequestTBO } from '../../middleware/tbo-auth';

class PrebookController {
    static async prebook(req: RequestTBO, res: Response, next: NextFunction) {
        try { } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

export default PrebookController;