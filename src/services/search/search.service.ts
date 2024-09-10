import axios from 'axios';
import CustomError from '../../utils/CustomError';
// import { Data } from '../../interfaces/search.interface';
import { mergeResponsesForDOM, mergeResponsesForINT } from '../../core/search.helpers';
import { requestBody, requestHeader, getVendorList, filterVendorList, maxTimeLimit } from '../../core/vendor.helpers';
import { getBaseUrl } from '../../config/config';
import logger from '../../utils/logger';
import { TBO, TBO_ENDPOINTS } from '../../utils/tbo.req';

class SearchService {
    static async search(data: any) {
        const requestBody = {};
        const { data: response } = await TBO.post(TBO_ENDPOINTS.HOTEL_SEARCH, requestBody, {
            auth: {
                username: "",
                password: ""
            }
        })
    }
}

export default SearchService;
