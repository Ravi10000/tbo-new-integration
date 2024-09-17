import { Router } from 'express';
import SearchController from './search.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { searchValidation } from '../../utils/validations/search.validation';
import { tboAuth } from '../../middleware/tbo-auth';

const router = Router();
router.post(
    '/search',
    searchValidation,
    validateRequest,
    tboAuth,
    SearchController.getSearches
);

export default router;
