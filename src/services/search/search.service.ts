import CustomError from '../../utils/CustomError';
import { mergeResponsesForDOM, mergeResponsesForINT } from '../../core/search.helpers';
// import { requestBody, requestHeader, getVendorList, filterVendorList, maxTimeLimit } from '../../core/vendor.helpers';
import { getBaseUrl } from '../../config/config';
import logger from '../../utils/logger';
import { TBO, TBO_ENDPOINTS } from '../../utils/tbo.req';
import { ISearchRequest, ITBORoom, ITBOHotelDetails, ITBOCombinedHotelDetails, ITBOHotelRates } from '../../interfaces/search.interface';
import { TBOCreds } from '../../middleware/inject-tbo-creds';
import City from '../../models/city.model';
import StaticHotel, { IStaticHotel } from '../../models/static-hotel.model';
import { generatePaxRooms } from '../../utils/search.util';
import crypto from "crypto"
import { iffy } from '../../utils/iffy';
import { generateRoomResponse } from '../../utils/generate-room-response';
interface IStaticHotelMap {
    [key: string]: IStaticHotel;
}
class SearchService {
    static async search(data: ISearchRequest, credentials: TBOCreds) {
        const city = await City.findOne({ Name: new RegExp(data.Destination.CityName) })
        if (!city) throw new Error("City not found");

        const query: { [key: string]: any } = { CityId: city.Code };
        if (data.StarRating) query.HotelRating = data.StarRating;
        const staticHotels = await StaticHotel.find(query).limit(100); // !temp limit
        const staticHotelsMap: IStaticHotelMap = {};
        staticHotels.forEach(hotel => {
            staticHotelsMap[hotel.HotelCode] = hotel.toObject();
        })

        const HotelCodes = staticHotels.map(hotel => hotel.HotelCode).join(",");
        const PaxRooms = generatePaxRooms(data.Rooms);
        const requestBody = {
            CheckIn: data.Check_In,
            CheckOut: data.Check_Out,
            HotelCodes,
            GuestNationality: data.Nationality,
            PaxRooms,
            IsDetailedResponse: true,
            Filters: {
                NoOfRooms: 1, // 1 or 0 | corresponds to the no. of room combinations and not no. of rooms
            }
        };

        const { data: hotelSearchResponse } = await TBO.post(TBO_ENDPOINTS.HOTEL_SEARCH, requestBody, {
            auth: {
                username: credentials.USERNAME,
                password: credentials.PASSWORD
            }
        })
        console.log({ hotelSearchResponse });
        if (hotelSearchResponse.Status.Code !== 200) throw new Error("Failed to get hotel details")

        let filteredHotels: ITBOHotelRates[] = hotelSearchResponse.HotelResult;
        if (data.BudgetAmountTo && data.BudgetAmountFrom) {
            filteredHotels = filteredHotels.filter((hotel) => {
                let totalFare = hotel.Rooms[0].TotalFare;
                return totalFare >= Number(data.BudgetAmountFrom) && totalFare <= Number(data.BudgetAmountTo);
            })
        }
        const hotelsList = hotelSearchResponse.HotelResult.map((hotel: any) => {
            let staticHotelDetails = staticHotelsMap[hotel.HotelCode];
            console.log({ staticHotelDetails });
            if (!staticHotelDetails) return hotel;
            const combinedHotel: ITBOCombinedHotelDetails = {
                ...staticHotelDetails,
                ...hotel,
            };
            const [hotelCode, resultIndex, traceID, _provider] = combinedHotel.Rooms[0].BookingCode.split("!TB!");
            const combinedResultIndex = combinedHotel.Rooms.map((room: ITBORoom) => room.BookingCode).join("|");
            const [latitude, longitude] = combinedHotel.Map.split("|");
            const searchID = crypto.randomUUID() + "|" + traceID;
            return {
                DocumentsRequired: null,
                searchID,
                AccomodationType: null,
                ChainName: null,
                supplierID: "TBO",
                hotelPicture: combinedHotel.Images[0],
                isHotDeal: false,
                hotelRatings: combinedHotel.HotelRating,
                code: combinedHotel.HotelCode,
                address: combinedHotel.Address,
                name: combinedHotel.HotelName,
                categoryCode: "",
                categoryName: "",
                latitude,
                longitude,
                minRate: null,
                maxRate: null,
                currency: combinedHotel.Currency ?? null,
                description: combinedHotel.Description ?? null,
                facilities: combinedHotel.HotelFacilities ?? null,
                totalPrice: combinedHotel.Rooms.reduce((acc: number, room: ITBORoom) => acc + room.TotalFare, 0),
                resultIndex: combinedResultIndex,
                hotelLocation: "others",
                Refundable: combinedHotel.Rooms[0].IsRefundable,
                RoomTypes: combinedHotel.Rooms.map((room) => ({
                    RoomTypeCode: room.BookingCode,
                    RoomRates: generateRoomResponse(room, hotelCode, resultIndex)
                }))
            }
        });
        const finalResult = {
            ContentType: "application/json",
            SerializerSettings: null,
            StatusCode: 200,
            Value: {
                hotelSearchRQRS: {
                    hotelSearchRQ: data,
                    hotels: {
                        hotel: hotelsList
                    }
                }
            }
        };
        return finalResult;
    }
}

export default SearchService;
