import { ISearchRequest, ITBORoom, ITBOCombinedHotelDetails, IHotelResponse } from '../../interfaces/search.interface';
import { ITBOCreds } from '../../middleware/tbo-auth';
import { generatePaxRooms, generateRoomResponse, latLng } from '../../core/search.helpers';
import { filterHotelsByPriceRange, getHotelsFare, getStaticHotels } from '../../core/search.helpers';

class SearchService {
    static async search(data: ISearchRequest, credentials: ITBOCreds) {
        const { staticHotelsMap, hotelCodeList } = await getStaticHotels(data)
        const PaxRooms = generatePaxRooms(data.rooms);
        const hotelsList: IHotelResponse[] = [];
        for (let codes of hotelCodeList) {
            const requestBody = {
                CheckIn: data.checkIn,
                CheckOut: data.checkOut,
                HotelCodes: codes,
                GuestNationality: data.nationality,
                PaxRooms,
                IsDetailedResponse: true,
                Filters: {
                    NoOfRooms: 0, // 1 or 0 | corresponds to the no. of room combinations and not no. of rooms
                }
            };
            const hotelRates = await getHotelsFare(requestBody, credentials);
            const filteredHotels = filterHotelsByPriceRange(hotelRates, data.budgetAmountFrom, data.budgetAmountTo);

            for (let hotel of filteredHotels) {
                let staticHotelDetails = staticHotelsMap[hotel.HotelCode];
                if (!staticHotelDetails) continue;
                const combinedHotel = {
                    ...staticHotelDetails,
                    ...hotel,
                } as ITBOCombinedHotelDetails;
                console.log({ combinedHotel });

                const [hotelCode, resultIndex, traceId, _provider] = combinedHotel.Rooms[0].BookingCode.split("!TB!");
                const combinedResultIndex = combinedHotel.Rooms.map((room: ITBORoom) => {
                    const [_hotelCode, resultIndex, _traceID, _provider] = room.BookingCode.split("!TB!");
                    return resultIndex;
                }).join("|");
                const [latitude, longitude] = latLng(combinedHotel.Map ?? "");
                hotelsList.push({
                    documentsRequired: null,
                    searchId: traceId,
                    accommodationType: null,
                    chainName: null,
                    supplierId: "TBO",
                    hotelPicture: combinedHotel.Images[0],
                    isHotDeal: false,
                    hotelRating: combinedHotel.HotelRating,
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
                    facilities: combinedHotel.HotelFacilities ? combinedHotel.HotelFacilities.map(facility => ({
                        amenityType: facility,
                        description: facility
                    })) : null,
                    totalPrice: combinedHotel.Rooms[0].TotalFare,
                    resultIndex: combinedResultIndex,
                    hotelLocation: "others",
                    refundable: combinedHotel.Rooms[0].IsRefundable,
                    roomTypes: combinedHotel.Rooms.map((room, roomIdx) => ({
                        roomTypeCode: room.BookingCode,
                        roomRates: generateRoomResponse(room, hotelCode, resultIndex, roomIdx)
                    }))
                })
            }
        }
        const finalResult = {
            contentType: "json",
            serializerSettings: null,
            statusCode: 200,
            value: {
                hotelSearchRQRS: {
                    hotelSearchRQ: data,
                    hotelsSearchRS: {
                        hotels: hotelsList,
                        total: hotelsList.length
                    }
                }
            }
        };
        return finalResult;
    }
}

export default SearchService;
