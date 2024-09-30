import { IDetailsRequest } from "../interfaces/details.interface";
import { ITBOHotelDetails, ITBOHotelRates } from "../interfaces/search.interface";
import { ITBOCreds } from "../middleware/tbo-auth";
import CustomError from "../utils/CustomError";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
import { generatePaxRooms, generateRoomResponse, latLng } from "./search.helpers";

export async function getHotelDetails(hotelCode: string, request: IDetailsRequest, credentials: ITBOCreds) {
    const { data } = await TBO.post(TBO_ENDPOINTS[credentials.TYPE].HOTEL_DETAILS, {
        HotelCodes: hotelCode.toString(),
        Language: "EN"
    });
    const fareRequest = {
        CheckIn: request.checkIn,
        CheckOut: request.checkOut,
        HotelCodes: hotelCode,
        PaxRooms: generatePaxRooms(request.rooms),
        GuestNationality: request.nationality,
        IsDetailedResponse: true,
        Filters: {
            NoOfRooms: 0
        }
    };
    const { data: fareRates } = await TBO.post(TBO_ENDPOINTS[credentials.TYPE].HOTEL_SEARCH, fareRequest, {
        auth: {
            username: credentials.USERNAME,
            password: credentials.PASSWORD
        }
    });

    if (!data?.HotelDetails?.length || !fareRates?.HotelResult?.length)
        throw new CustomError("Error Fetching Hotel Details", 500);
    const hotel = data.HotelDetails[0] as ITBOHotelDetails;
    const fareRate = fareRates.HotelResult[0] as ITBOHotelRates;
    const [latitude, longitude] = latLng(hotel.Map ?? "");
    console.log({ latLng: hotel.Map });

    const hotelDetails = {
        checkInTime: hotel.CheckInTime,
        checkOutTime: hotel.CheckOutTime,
        searchId: request.searchId,
        hotelPicture: hotel.Images?.[0],
        isHotDeal: false,
        hotelRating: hotel.HotelRating,
        code: hotel.HotelCode,
        address: hotel.Address,
        name: hotel.HotelName,
        categoryCode: null,
        categoryName: null,
        latitude,
        longitude,
        minRate: null,
        maxRate: null,
        currency: null,
        description: hotel.Description,
        totalPrice: fareRate.Rooms?.[0]?.TotalFare,
        imagePath: hotel.Images?.[0],
        resultIndex: null,
        hotelLocation: null,
        roomTypes: fareRate?.Rooms?.map?.((room, roomIdx) => ({
            roomTypeCode: room.BookingCode,
            roomRates: generateRoomResponse(room, hotelCode, "1", roomIdx)
        })),
    };
    return {
        hotelDetails,
        hotelImages: hotel.Images?.map?.(image => ({ type: 'regular', url: image })),
        facilities: hotel.HotelFacilities?.map?.(facility => ({
            amenityType: facility,
            description: facility
        })),
        inAndArounds: []
    };
}