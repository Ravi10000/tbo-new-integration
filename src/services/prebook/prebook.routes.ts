import { Router } from "express";
import { injectTBOCredentials } from "../../middleware/inject-tbo-creds";
import { validateRequest } from "../../middleware/validateRequest";
import PrebookController from "./prebook.controller";
import { prebookValidations } from "../../utils/validations/prebook.validation";
const router = Router();

router.post("/prebook", injectTBOCredentials, prebookValidations, validateRequest, PrebookController.prebook)
export default router;