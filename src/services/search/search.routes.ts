import { Router } from 'express';
import SearchController from './search.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { searchValidation } from '../../utils/validations/search.validation';
const router = Router();
router.post(
    '/search',
    searchValidation,
    validateRequest,
    SearchController.getSearches
);

export default router;
