import { MongoUrl } from "../config/config";
import { connectionMongoDb } from "../config/connection";
import StaticHotel from "../models/static-hotel.model";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";

export async function hotelSeeder() {
    try {
        await connectionMongoDb(MongoUrl());
        const doesHotelsExits = await StaticHotel.exists({});
        if (doesHotelsExits) throw new Error("Static Hotel already exists");
        const { data: hotelCodesResponse } = await TBO.post(TBO_ENDPOINTS.TBO_HOTEL_CODES, { CityCode: "130443", IsDetailedResponse: false });
        const hotelCodesLength = hotelCodesResponse.Hotels.length;
        let [from, to] = [0, 100];
        do {
            console.log({ from, to, hotelCodesLength });
            const currentCodes = hotelCodesResponse.Hotels.map((hotel: { HotelCode: string }) => hotel.HotelCode).slice(from, to).join(",")
            from = to;
            to = (hotelCodesLength > (to + 100)) ? (to + 100) : hotelCodesLength;
            console.log("fetching hotel details");
            const { data: hotelResponse } = await TBO.post(TBO_ENDPOINTS.HOTEL_DETAILS, { HotelCodes: currentCodes, Language: "EN" })
            await StaticHotel.insertMany(hotelResponse.HotelDetails);
        } while (to <= 500)
        console.log("saved all hotels");
    } catch (error) {
        console.log({ error });
    } finally {
        process.exit(0)
    }
}

hotelSeeder()