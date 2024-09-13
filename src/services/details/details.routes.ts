import { Router } from "express";
import DetailsController from "./details.controller";

const router = Router();

router.post("/details", DetailsController.fetchHotelDetails)

export default router;