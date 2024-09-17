import { DayRate, ICancelPolicy, IInclusion, ISearchRequest, IStaticHotelMap, ITBOHotelRates } from "../interfaces/search.interface";
import { ITBOCreds } from "../middleware/tbo-auth";
import City, { ICity } from "../models/city.model";
import StaticHotel, { IStaticHotel } from "../models/static-hotel.model";
import CustomError from "../utils/CustomError";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
import { ITBOPaxRoom, IRoom } from "../interfaces/search.interface";
import { IRoomRate, ITBORoom } from "../interfaces/search.interface";
import dayjs from "dayjs";


export async function getStaticHotels(data: ISearchRequest) {
    const city = await City.findOne<ICity | null>({ Name: new RegExp(data.destination.cityName) });
    console.log({ city });

    if (!city) throw new CustomError("city not found", 404);
    const query: { [key: string]: any } = { CityId: city.Code };
    if (data.starRating) query.HotelRating = data.starRating;

    const staticHotels = await StaticHotel.find(query).limit(100); // !temp limit
    const staticHotelsMap: IStaticHotelMap = staticHotels.reduce(
        (acc: IStaticHotelMap, hotel) => { acc[hotel.HotelCode] = hotel.toObject(); return acc; },
        {});
    const hotelCodeList = generateHotelCodesList(staticHotels);
    return { staticHotelsMap, hotelCodeList }
}

export async function getHotelsFare(requestBody: any, credentials: ITBOCreds): Promise<ITBOHotelRates[]> {
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
export function generateHotelCodesList(hotels: IStaticHotel[], limit = 100) {
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
    const cancelPenalties = generateCancelPenalties(room);

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
            })) as IInclusion[] : null,
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
            cancelPenalties,
            hotelComments: [],
        }
    }) as IRoomRate[];
    return roomRates;
}

export function generateCancelPenalties(room: ITBORoom) {
    const cancelPenalties = [];
    const fixedCharge = room.CancelPolicies.find(policy => policy.ChargeType === "Fixed");
    if (fixedCharge) {
        cancelPenalties.push({
            name: "Cancellation By Date",
            penaltyDescription: `Cancellation charges : ${fixedCharge.CancellationCharge} INR will be applicable from date ${getDate(fixedCharge.FromDate).format("DD/MM/YYYY hh:mm:ss A")}`,
            nonRefundable: !room.IsRefundable
        })
    }
    const percentageCharge = room.CancelPolicies.find(policy => policy.ChargeType === "Percentage");
    if (percentageCharge) {
        cancelPenalties.push({
            name: "Cancellation Fee",
            penaltyDescription: `Cancellation charges : ${(room.TotalFare / 100) * percentageCharge.CancellationCharge} INR will be applicable from date ${getDate(percentageCharge.FromDate).format("DD/MM/YYYY hh:mm:ss A")}`,
            nonRefundable: !room.IsRefundable
        })
    }
    if (!room.IsRefundable) {
        cancelPenalties.push({
            name: "Non-Refundable",
            penaltyDescription: "Booking is non refundable",
            nonRefundable: true
        })
    }
    return cancelPenalties;
}

export function getDate(dateString: string) {
    const [date, time] = dateString.split(" ");
    const [day, month, year] = date.split("-");
    console.log({ date, time, day, month, year });
    const dayObject = dayjs(`${year}-${month}-${day}T${time}`);
    console.log({ date: dayObject.format("DD-MM-YYYY hh:mm:ss A") });
    return dayObject;
}