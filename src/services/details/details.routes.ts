import { Router } from "express";
import DetailsController from "./details.controller";
import { detailsValidations } from "../../utils/validations/details.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { injectTBOCredentials } from "../../middleware/inject-tbo-creds";

const router = Router();

router.post("/details", injectTBOCredentials, detailsValidations, validateRequest, DetailsController.fetchHotelDetails)

export default router;