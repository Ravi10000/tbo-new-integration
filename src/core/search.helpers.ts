import { ISearchRequest, IStaticHotelMap, ITBOHotelRates } from "../interfaces/search.interface";
import { TBOCreds } from "../middleware/inject-tbo-creds";
import { ICity } from "../models/city.model";
import StaticHotel, { IStaticHotel } from "../models/static-hotel.model";
import CustomError from "../utils/CustomError";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
import { IPaxRoom, IRoom } from "../interfaces/search.interface";


export async function getStaticHotels(data: ISearchRequest, city: ICity) {
    const query: { [key: string]: any } = { CityId: city.Code };
    if (data.StarRating) query.HotelRating = data.StarRating;

    const staticHotels = await StaticHotel.find(query);
    const staticHotelsMap: IStaticHotelMap = staticHotels.reduce(
        (acc: IStaticHotelMap, hotel) => { acc[hotel.HotelCode] = hotel.toObject(); return acc; },
        {});
    const hotelCodeList = generateHotelCodesList(staticHotels);
    return { staticHotelsMap, hotelCodeList }
}

export async function getHotelsFare(requestBody: any, credentials: TBOCreds): Promise<ITBOHotelRates[]> {
    const { data } = await TBO.post(TBO_ENDPOINTS.HOTEL_SEARCH, requestBody, {
        auth: {
            username: credentials.USERNAME,
            password: credentials.PASSWORD
        }
    })
    if (data.Code !== 200) throw new CustomError("hotels search error", 500, data);
    return data.HotelResult;
}
export function filterHotelsByPriceRange(hotels: ITBOHotelRates[], min: number | null | undefined, max: number | null | undefined): ITBOHotelRates[] {
    if (min && max)
        hotels = hotels.filter((hotel) => {
            let totalFare = hotel.Rooms[0].TotalFare;
            return totalFare >= Number(min) && totalFare <= Number(max);
        })
    return hotels;
}

export function generatePaxRooms(rooms: IRoom[]): IPaxRoom[] {
    const PaxRooms = [];
    for (let room of rooms) {
        let roomDetails: IPaxRoom = {
            Adults: 0,
            Children: 0,
            ChildrenAges: [],
        };
        for (let guest of room.Guests) {
            if (guest.GuestType === "ADT")
                roomDetails.Adults += 1;
            else {
                roomDetails.Children += 1;
                if (guest.GuestAge && roomDetails.ChildrenAges)
                    roomDetails.ChildrenAges.push(guest.GuestAge);
            }
        }
        if (!roomDetails?.ChildrenAges?.length) {
            roomDetails.ChildrenAges = null;
        }
        PaxRooms.push(roomDetails);
    }
    return PaxRooms;
}
export function generateHotelCodesList(hotels: IStaticHotel[], limit: number = 100) {
    let [from, to] = [0, limit];
    const hotelCodeList: string[] = [];
    while (to <= hotels.length) {
        const codes = hotels.slice(from, to).map(hotel => hotel.HotelCode).join(",");
        hotelCodeList.push(codes);
        from = to;
        to = Math.min(hotels.length, (to + limit));
    }
    return hotelCodeList;
}