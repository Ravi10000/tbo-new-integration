import jwt from 'jsonwebtoken';

class AuthService {
    static async login(username: string, password: string) {
        // Validate user logic
        const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return token;
    }
}

export default AuthService;
