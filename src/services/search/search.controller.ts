import { Response, NextFunction } from 'express';
import SearchService from './search.service';
import { RequestTBO } from '../../middleware/tbo-auth';
import CustomError from '../../utils/CustomError';

class SearchController {
    static async getSearches(req: RequestTBO, res: Response, next: NextFunction) {
        try {
            if (!req.TBO?.USERNAME || !req.TBO?.PASSWORD) throw new CustomError("TBO credentials required", 400)
            const result = await SearchService.search(req.body, req.TBO);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Search results retrieved successfully',
                result: { searchRS: result }
            });
        } catch (err) {
            console.log({ err });
            next(err); // Pass the error to the error handler middleware
        }
    }
}
export default SearchController;
