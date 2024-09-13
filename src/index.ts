import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { connectionMongoDb } from './config/connection';
import { MongoUrl } from './config/config';
import searchRoutes from './services/search/search.routes';
import authRoutes from './services/auth/auth.routes';
import errorHandler from './middleware/errorHandler';
import detailsRoutes from "../src/services/details/details.routes"
dotenv.config();
// Load environment variables

const app = express();

// app.use(compression())
app.use(express.json());
app.use('/api/hotels', searchRoutes);
app.use('/api/hotels', detailsRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    await connectionMongoDb(MongoUrl());
    console.log(`Server is running on port ${PORT}`);
});
