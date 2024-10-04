// import { MongoUrl } from "../config/config";
// import { connectionMongoDb } from "../config/connection";
import City from "../models/city.model";
import StaticHotel from "../models/static-hotel.model";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";

export async function hotelSeeder() {
    try {
        // await connectionMongoDb(MongoUrl());
        const doesHotelsExits = await StaticHotel.exists({});
        if (doesHotelsExits) throw new Error("Static Hotel already exists");
        const cities = await City.find();
        for (let city of cities) {
            const { data: hotelCodesResponse } = await TBO.post(TBO_ENDPOINTS.TEST.TBO_HOTEL_CODES, { CityCode: city.Code, IsDetailedResponse: false });
            const hotelCodesLength = hotelCodesResponse?.Hotels?.length;
            let [from, to] = [0, 100];

            if (!hotelCodesLength) {
                console.log(`city codes not found for ${city.Code} - ${city.Name}`)
                continue;
            }
            do {
                console.log({ from, to, hotelCodesLength });
                const currentCodes = hotelCodesResponse.Hotels.map((hotel: { HotelCode: string }) => hotel.HotelCode).slice(from, to).join(",");
                from = to;
                // to = (hotelCodesLength > (to + 100)) ? (to + 100) : hotelCodesLength;
                to += 100;
                console.log("fetching hotel details");
                const { data: hotelResponse } = await TBO.post(TBO_ENDPOINTS.TEST.HOTEL_DETAILS, { HotelCodes: currentCodes, Language: "EN" })
                await StaticHotel.insertMany(hotelResponse.HotelDetails);
            } while (from <= hotelCodesLength)
            console.log(`saved hotels for ${from} - ${to} for ${city.Name} & ${city.Code}`);
        }
    } catch (error) {
        console.log({ error });
    } finally {
        process.exit(0)
    }
}