import express, { Response, Request } from 'express';
import compression from 'compression';
import 'express-async-errors';
import dotenv from 'dotenv';
import { connectionMongoDb } from './config/connection';
import { MongoUrl } from './config/config';
import searchRoutes from './services/search/search.routes';
import errorHandler from './middleware/errorHandler';
import detailsRoutes from "../src/services/details/details.routes";
import prebookRoutes from "../src/services/prebook/prebook.routes";
import bookRoutes from "../src/services/book/book.routes";
import bookingDetailsRoutes from "../src/services/booking-details/booking-details.routes"
import cancelBookingRoutes from "../src/services/cancel-booking/cancel-booking.routes"
import cancelBookingStatusRoutes from "../src/services/cancel-booking-status/cancel-booking-status.routes"
import voucherRoutes from "../src/services/voucher-booking/voucher-booking.routes"
dotenv.config();
// import { encrypt, decrypt } from './utils/aes-encryption';
// const encryptedUsername = encrypt("Allfour");
// const username = decrypt(encryptedUsername);
// console.log({
//     encryptedUsername,
//     username,
//     encryptedPassword: encrypt("Allfour@1234"),
//     password: decrypt(encrypt("Allfour@1234")),
//     encryptedTokenId: encrypt("15099cf5-d6c5-4f45-9048-782da3f9b9b9"),
//     tokenId: decrypt(encrypt("15099cf5-d6c5-4f45-9048-782da3f9b9b9"))
// })
// Load environment variables

const app = express();

// app.use(compression())
app.use(express.json());
app.use(compression());
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "success", message: "TBO APIs" })
})
app.use('/api/hotels', searchRoutes);
app.use('/api/hotels', detailsRoutes);
app.use('/api/hotels', prebookRoutes);
app.use('/api/hotels', bookRoutes);
app.use('/api/hotels', bookingDetailsRoutes);
app.use('/api/hotels', cancelBookingRoutes);
app.use('/api/hotels', cancelBookingStatusRoutes);
app.use('/api/hotels', voucherRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    await connectionMongoDb(MongoUrl());
    console.log(`Server is running on port ${PORT}`);
});
