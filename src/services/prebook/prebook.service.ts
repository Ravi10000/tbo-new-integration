import { IPrebookRequest } from "../../interfaces/prebook.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class PrebookService {
    static async prebook(data: IPrebookRequest, creds: ITBOCreds) {
        const { data: response } = await TBO.post(TBO_ENDPOINTS.PRE_BOOK, {
            BookingCode: data.roomDetails[0].roomTypes.roomTypeCode,
            PaymentMode: "Limit"
        }, {
            auth: {
                username: creds.USERNAME,
                password: creds.PASSWORD
            }
        });
        return response;
    }
}

export default PrebookService;