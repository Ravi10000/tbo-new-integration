import { Response, NextFunction } from "express"
import { RequestTBO } from '../../middleware/inject-tbo-creds';

class PrebookController {
    static async prebook(req: RequestTBO, res: Response, next: NextFunction) {
        try { } catch (err) {
            console.log(err);
            next(err);
        }
    }
}