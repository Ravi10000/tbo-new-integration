import { Router } from "express";
import { tboAuth } from "../../middleware/tbo-auth";
import { validateRequest } from "../../middleware/validateRequest";
import PrebookController from "./prebook.controller";
import { prebookValidations } from "../../utils/validations/prebook.validation";
const router = Router();

router.post("/pre-book", prebookValidations, validateRequest, tboAuth, PrebookController.prebook)
export default router;