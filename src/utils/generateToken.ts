import jwt from 'jsonwebtoken';

const generateToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export default generateToken;
