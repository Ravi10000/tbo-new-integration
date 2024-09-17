import { Router } from 'express';
import SearchController from './search.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { searchValidation } from '../../utils/validations/search.validation';
import { injectTBOCredentials } from '../../middleware/inject-tbo-creds';

const router = Router();
router.post(
    '/search',
    searchValidation,
    validateRequest,
    injectTBOCredentials,
    SearchController.getSearches
);

export default router;
