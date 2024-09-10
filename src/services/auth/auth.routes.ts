import { Router } from 'express';
import AuthController from './auth.controller';
import { check } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.post(
    '/login',
    [
        check('username').notEmpty().withMessage('Username is required'),
        check('password').notEmpty().withMessage('Password is required'),
    ],
    validateRequest,
    AuthController.login
);

export default router;
