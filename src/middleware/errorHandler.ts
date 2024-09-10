// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';

const errorHandler = (err: CustomError | any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const status = err.status || 500;
    const response = {
        success: false,
        status: status,
        message: err.message || 'Internal Server Error',
        reason: err.reason || null,
    };

    res.status(status).json(response);
};

export default errorHandler;
