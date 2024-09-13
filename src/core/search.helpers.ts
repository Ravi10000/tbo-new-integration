import { DayRate, Inclusion, ISearchRequest, IStaticHotelMap, ITBOHotelRates } from "../interfaces/search.interface";
import { TBOCreds } from "../middleware/inject-tbo-creds";
import City, { ICity } from "../models/city.model";
import StaticHotel, { IStaticHotel } from "../models/static-hotel.model";
import CustomError from "../utils/CustomError";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
import { ITBOPaxRoom, IRoom } from "../interfaces/search.interface";
import { IRoomRate, ITBORoom } from "../interfaces/search.interface";

export async function getStaticHotels(data: ISearchRequest) {
    const city = await City.findOne<ICity | null>({ Name: new RegExp(data.destination.cityName) });
    console.log({ city });

    if (!city) throw new CustomError("city not found", 404);
    const query: { [key: string]: any } = { CityId: city.Code };
    if (data.starRating) query.HotelRating = data.starRating;

    const staticHotels = await StaticHotel.find(query).limit(50);
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
    if (data.Status.Code !== 200) throw new CustomError("hotels search error", 500, data);
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

export function generatePaxRooms(rooms: IRoom[]): ITBOPaxRoom[] {
    const PaxRooms = [];
    for (let room of rooms) {
        let roomDetails: ITBOPaxRoom = {
            Adults: 0,
            Children: 0,
            ChildrenAges: [],
        };
        for (let guest of room.guests) {
            if (guest.guestType === "ADT")
                roomDetails.Adults += 1;
            else {
                roomDetails.Children += 1;
                if (guest.guestAge && roomDetails.ChildrenAges)
                    roomDetails.ChildrenAges.push(guest.guestAge);
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
    do {
        console.log({ from, to });
        const codes = hotels.slice(from, to).map(hotel => hotel.HotelCode).join(",");
        console.log({ codes });
        hotelCodeList.push(codes);
        from = to;
        to = Math.min(hotels.length, (to + limit));
    } while (to < hotels.length)
    return hotelCodeList;
}

export function generateRoomResponse(room: ITBORoom, hotelCode: string, resultIndex: string, roomIdx: number): IRoomRate[] {
    const roomPrice = room.TotalFare / (room.Name.length);
    const roomTax = room.TotalTax / room.Name.length;
    // const cancelPenalties = [];
    // const cancellationFees = room.CancelPolicies.find(c => c.CancellationCharge == 100);

    const roomRates = room.Name.map((name: string, idx) => {
        const id = [hotelCode, resultIndex, roomIdx, idx].join("|");
        const basePrice = room.DayRates[idx].reduce((acc: number, dayRate: DayRate) => acc + dayRate.BasePrice, 0);
        return {
            roomId: id,
            roomName: name,
            roomTypeCode: id,
            roomDescription: null,
            roomReference: null,
            images: null,
            guests: [],
            inclusions: room.Inclusion ? room.Inclusion.split(",").map((inclusion: string) => ({
                boardingDetails: null,
                inclusionDescription: inclusion
            })) as Inclusion[] : null,
            rates: [
                {
                    totalPrice: roomPrice,
                    basePrice: basePrice,
                    taxes: roomTax,
                    taxBreakup: [
                        {
                            type: "Tax",
                            amount: roomTax
                        },
                        // {
                        //     Type: "ServiceCharge",
                        //     Amount: 0.0
                        // },
                        // {
                        //     Type: "ServiceTax",
                        //     Amount: 0.0
                        // },
                        // {
                        //     Type: "OtherCharges",
                        //     Amount: 0.0
                        // }
                    ],
                    additionalGuestAmount: 0,
                    commission: {
                        amount: 0,
                        taxOnCommission: 0,
                        taxType: null,
                        netCommission: 0,
                        hotelTaxIncluded: null,
                        percent: 0
                    },
                    markup: 0,
                    commercial: null,
                    b2bCommercial: null
                }
            ],
            cancelPenalties: [], // todo: add cancel penalties
            hotelComments: [],
        }
    }) as IRoomRate[];
    return roomRates;
}