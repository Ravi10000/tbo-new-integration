import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import searchRoutes from './services/search/search.routes';
import authRoutes from './services/auth/auth.routes';
import errorHandler from './middleware/errorHandler';
// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/hotels', searchRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
