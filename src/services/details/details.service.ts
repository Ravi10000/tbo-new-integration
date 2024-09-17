import { getHotelDetails } from "../../core/details.helper";
import { IDetailsRequest } from "../../interfaces/details.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";

class DetailsService {
    static async getDetails(data: IDetailsRequest, creds: ITBOCreds) {
        const result = await getHotelDetails(data.hotelCode, data, creds);
        return result;
    }
}

export default DetailsService;