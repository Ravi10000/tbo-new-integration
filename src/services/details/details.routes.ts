import { Router } from "express";
import DetailsController from "./details.controller";
import { detailsValidations } from "../../utils/validations/details.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { tboAuth } from "../../middleware/tbo-auth";

const router = Router();

router.post("/details", tboAuth, detailsValidations, validateRequest, DetailsController.fetchHotelDetails)

export default router;