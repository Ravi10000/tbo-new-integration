import { Router } from "express";
import BookController from "./book.controller";
import { bookValidations } from "../../utils/validations/book.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { tboAuth } from "../../middleware/tbo-auth";
const router = Router();

router.post("/book", bookValidations, validateRequest, tboAuth, BookController.bookHotel)

export default router;