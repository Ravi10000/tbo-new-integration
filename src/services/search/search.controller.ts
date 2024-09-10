// src/services/search/search.controller.ts

import { Request, Response, NextFunction } from 'express';
import SearchService from './search.service';

class SearchController {
    static async getSearches(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await SearchService.search(req.body);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Search results retrieved successfully',
                // data: result
            });
        } catch (err) {
            next(err); // Pass the error to the error handler middleware
        }
    }
}

export default SearchController;
