import CustomError from '../../utils/CustomError';
import { ISearchRequest, ITBORoom, ITBOCombinedHotelDetails, IHotelResponse } from '../../interfaces/search.interface';
import { TBOCreds } from '../../middleware/inject-tbo-creds';
import City from '../../models/city.model';
import { generatePaxRooms } from '../../utils/search.util';
import crypto from "crypto"
import { generateRoomResponse } from '../../utils/generate-room-response';
import { filterHotelsByPriceRange, getHotelsFare, getStaticHotels } from '../../core/search.helpers';

class SearchService {
    static async search(data: ISearchRequest, credentials: TBOCreds) {
        const city = await City.findOne({ Name: new RegExp(data.Destination.CityName) });
        if (!city) throw new CustomError("city not found", 404);
        const uniqueSearchId = crypto.randomUUID();
        const { staticHotelsMap, hotelCodeList } = await getStaticHotels(data, city)
        const PaxRooms = generatePaxRooms(data.Rooms);
        const hotelsList: IHotelResponse[] = [];
        for (let codes of hotelCodeList) {
            const requestBody = {
                CheckIn: data.Check_In,
                CheckOut: data.Check_Out,
                HotelCodes: codes,
                GuestNationality: data.Nationality,
                PaxRooms,
                IsDetailedResponse: true,
                Filters: {
                    NoOfRooms: 0, // 1 or 0 | corresponds to the no. of room combinations and not no. of rooms
                }
            };
            const hotelRates = await getHotelsFare(requestBody, credentials);
            const filteredHotels = filterHotelsByPriceRange(hotelRates, data.BudgetAmountFrom, data.BudgetAmountTo);

            for (let hotel of filteredHotels) {
                let staticHotelDetails = staticHotelsMap[hotel.HotelCode];
                if (!staticHotelDetails) continue;
                const combinedHotel = {
                    ...staticHotelDetails,
                    ...hotel,
                } as ITBOCombinedHotelDetails;

                const [hotelCode, resultIndex, traceID, _provider] = combinedHotel.Rooms[0].BookingCode.split("!TB!");
                const combinedResultIndex = combinedHotel.Rooms.map((room: ITBORoom) => {
                    const [_hotelCode, resultIndex, _traceID, _provider] = room.BookingCode.split("!TB!");
                    return resultIndex;
                }).join("|");
                const [latitude, longitude] = combinedHotel.Map.split("|");
                const searchID = uniqueSearchId + "|" + traceID;
                hotelsList.push({
                    DocumentsRequired: null,
                    searchID,
                    AccommodationType: null,
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
                    RoomTypes: combinedHotel.Rooms.map((room, roomIdx) => ({
                        RoomTypeCode: room.BookingCode,
                        RoomRates: generateRoomResponse(room, hotelCode, resultIndex, roomIdx)
                    }))
                })
            }
        }
        const finalResult = {
            ContentType: "json",
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
