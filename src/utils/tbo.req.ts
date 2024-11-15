import axios from "axios"
import { generateBasicAuth } from "./generate-basic-auth";

export const TBO = axios.create();
TBO.defaults.headers.common["Accept-Encoding"] = "gzip, deflate";
TBO.defaults.headers.common["Content-Type"] = "application/json";
TBO.defaults.headers.common["Authorization"] = generateBasicAuth("TBOStaticAPITest", "Tbo@11530818");
// TBO.defaults.auth = {
//     username: "TBOStaticAPITest",
//     password: "Tbo@11530818"
// }
// TBO.interceptors.request.use(function (config) {
//     console.dir({ config }, { depth: null });
//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });
export const TBO_ENDPOINTS = {
    TEST: {
        AUTHENTICATE:
            "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
        COUNTRY_LIST: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CountryList",
        CITY_LIST: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList",
        HOTEL_CODES: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/hotelcodelist",
        TBO_HOTEL_CODES:
            "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
        HOTEL_SEARCH: "https://affiliate.tektravels.com/HotelAPI/Search",
        HOTEL_DETAILS:
            "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails",
        PRE_BOOK: "https://affiliate.tektravels.com/HotelAPI/PreBook",
        BOOK: "https://hotelbe.tektravels.com/hotelservice.svc/rest/book",
        // BOOK: "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Book",
        BOOKING_DETAILS:
            "http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail",
        GENERATE_VOUCHER:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",
        CANCEL_BOOKING:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest",
        CANCEL_BOOKING_STATUS:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus",
    },
    LIVE: {
        AUTHENTICATE:
            "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
        COUNTRY_LIST: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CountryList",
        CITY_LIST: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList",
        HOTEL_CODES: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/hotelcodelist",
        TBO_HOTEL_CODES:
            "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
        HOTEL_SEARCH: "https://affiliate.tektravels.com/HotelAPI/Search",
        HOTEL_DETAILS:
            "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails",
        PRE_BOOK: "https://affiliate.tektravels.com/HotelAPI/PreBook",
        BOOK: "https://hotelbe.tektravels.com/hotelservice.svc/rest/book",
        BOOKING_DETAILS:
            "http://api.tektravels.com/BookingEngineService_Hotel/HotelService.svc/rest/GetBookingDetail",
        GENERATE_VOUCHER:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GenerateVoucher",
        CANCEL_BOOKING:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/SendChangeRequest",
        CANCEL_BOOKING_STATUS:
            "http://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetChangeRequestStatus",
    }
};