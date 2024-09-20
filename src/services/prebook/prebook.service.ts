import { IPrebookRequest } from "../../interfaces/prebook.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class PrebookService {
    static async prebook(data: IPrebookRequest, creds: ITBOCreds) {
        const bookingCode = data.roomDetails[0].roomTypes.roomTypeCode;
        const { data: response } = await TBO.post(TBO_ENDPOINTS.PRE_BOOK, {
            BookingCode: bookingCode,
            PaymentMode: "Limit"
        }, {
            auth: {
                username: creds.USERNAME,
                password: creds.PASSWORD
            }
        });
        const availability = response?.HotelResult?.Rooms?.[0]?.BookingCode === bookingCode
            ? "confirm"
            : "not-available";
        return availability;
    }
}

export default PrebookService;