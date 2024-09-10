import { Request, Response } from 'express';
import AuthService from './auth.service';

class AuthController {
    static async login(req: Request, res: Response) {
        const token = await AuthService.login(req.body.username, req.body.password);
        res.json({ token });
    }
}

export default AuthController;
