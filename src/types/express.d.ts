declare namespace Express {
    interface Request {
        TBO?: {
            USERNAME: string;
            PASSWORD: string;
        };
    }
}