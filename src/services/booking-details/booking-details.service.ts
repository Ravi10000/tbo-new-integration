import { destructBookingId } from "../../core/book.helper";
import { IBookingDetailsRequest } from "../../interfaces/booking-details.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class BookingDetailsService {
    static async getBookingDetails(request: IBookingDetailsRequest, creds: ITBOCreds) {
        const { bookingId: tboBookingId } = destructBookingId(request.bookingReference);
        const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].BOOKING_DETAILS, {
            EndUserIp: "192.168.9.119",
            TokenId: creds.TOKEN_ID,
            BookingId: tboBookingId
        }, {
            auth: {
                username: creds.USERNAME,
                password: creds.PASSWORD,
            }
        })
        return response;
    }
}

export default BookingDetailsService;