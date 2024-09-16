import { getHotelDetails } from "../../core/details.helper";
import { IDetailsRequest } from "../../interfaces/details.interface";
import { TBOCreds } from "../../middleware/inject-tbo-creds";

class DetailsService {
    static async getDetails(data: IDetailsRequest, creds: TBOCreds) {
        const result = await getHotelDetails(data.hotelCode, data, creds);
        return result;
    }
}

export default DetailsService;