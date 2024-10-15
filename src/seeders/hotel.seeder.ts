import { MongoUrl } from "../config/config";
import { connectionMongoDb } from "../config/connection";
import City from "../models/city.model";
import StaticHotel from "../models/static-hotel.model";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";
import fs from 'fs';
import path from 'path';
const filePath = path.resolve(__dirname);
console.log({ filePath })
export async function hotelSeeder() {
    let savedHotelCodes = JSON.parse(fs.readFileSync(`${filePath}/saved-hotel-codes.json`, "utf8"))?.savedHotelCodes;
    try {
        await connectionMongoDb(MongoUrl());
        const staticHotelsLength = await StaticHotel.countDocuments();
        if (!savedHotelCodes?.length || savedHotelCodes.length !== staticHotelsLength) {
            const allHotels = await StaticHotel.find();
            savedHotelCodes = allHotels.map((hotel) => hotel.HotelCode);
            fs.writeFileSync(`${filePath}/saved-hotel-codes.json`, JSON.stringify({ savedHotelCodes }, null, 2));
        }
        console.log({ savedHotelCodesLength: savedHotelCodes.length });
        const savedCodesMap = savedHotelCodes.reduce((map: {}, code: string) => ({ ...map, [code]: true }), {});
        const { data: hotelCodeResponse } = await TBO.get(TBO_ENDPOINTS.TEST.HOTEL_CODES);
        const hotelCodes = hotelCodeResponse.HotelCodes;
        const hotelCodesLength = hotelCodes?.length;
        console.log({ hotelCodesLength });
        // const unsavedHotelCodes = hotelCodes.filter((code: string) => !savedHotelCodes.includes(code));
        const unsavedHotelCodes = hotelCodes.filter((code: string) => !savedCodesMap[code]);
        console.log({
            unsavedHotelCodesLength: unsavedHotelCodes.length,
            savedHotelCodesLength: savedHotelCodes.length
        });
        let [from, to] = [0, 100];
        // ? all codes
        while (from <= unsavedHotelCodes?.length) {
            console.log({ from, to });
            const codeList = unsavedHotelCodes.slice(from, to);
            if (!codeList.length) {
                from = to;
                to += 100;
                continue;
            }
            const currentCodes = codeList.join(",");
            console.log(`fetching hotel details from ${from}-${to}`);
            try {
                const { data: hotelResponse } = await TBO.post(TBO_ENDPOINTS.TEST.HOTEL_DETAILS, { HotelCodes: currentCodes, Language: "EN" });
                if (hotelResponse.HotelDetails?.length) {
                    await StaticHotel.insertMany(hotelResponse.HotelDetails);
                    savedHotelCodes = [...savedHotelCodes, ...codeList];
                    fs.writeFileSync(`${filePath}/saved-hotel-codes.json`, JSON.stringify({ savedHotelCodes }, null, 2));
                    console.log(`saved hotels for ${from} - ${to}`);
                } else {
                    console.log(`no hotels found`);
                }
            } catch (error: any) {
                console.log({ error });
                fs.writeFileSync(`${filePath}/${Date.now()}-error.json`, JSON.stringify({ error: error.message, from, to, currentCodes }, null, 2));
            }
            from = to;
            to += 100;
        }

        // ? city vise
        // const cities = await City.find();
        // for (let city of cities) {
        //     const { data: hotelCodesResponse } = await TBO.post(TBO_ENDPOINTS.TEST.TBO_HOTEL_CODES, { CityCode: city.Code, IsDetailedResponse: false });
        //     const hotelCodes = hotelCodesResponse?.Hotels?.map((hotel: { HotelCode: string }) => hotel.HotelCode);
        //     const hotelCodesLength = hotelCodes?.length;
        //     console.log({ hotelCodesLength });
        //     let [from, to] = [0, 100];

        //     if (!hotelCodesLength) {
        //         console.log(`city codes not found for ${city.Code} - ${city.Name}`)
        //         continue;
        //     }
        //     while (from <= hotelCodesLength) {
        //         console.log({ from, to, hotelCodesLength });
        //         const codeList = hotelCodes.slice(from, to).filter((code: string) => !savedHotelCodes.includes(code));
        //         if (!codeList.length) {
        //             from = to;
        //             to += 100;
        //             continue;
        //         }
        //         const currentCodes = codeList.join(",");
        //         console.log(`fetching hotel details from ${from}-${to}`);
        //         const { data: hotelResponse } = await TBO.post(TBO_ENDPOINTS.TEST.HOTEL_DETAILS, { HotelCodes: currentCodes, Language: "EN" });
        //         if (hotelResponse.HotelDetails?.length) {
        //             await StaticHotel.insertMany(hotelResponse.HotelDetails);
        //             savedHotelCodes = [...savedHotelCodes, ...codeList];
        //             fs.writeFileSync(filePath, JSON.stringify({ savedHotelCodes }, null, 2));
        //             console.log(`saved hotels for ${from} - ${to} for city ${city.Name} with city code ${city.Code} `);
        //         } else {
        //             console.log(`no hotels found for city ${city.Name} with city code ${city.Code}`);
        //         }
        //         from = to;
        //         to += 100;
        //     }
        // }
    } catch (error) {
        console.log({ error });
    } finally {
        console.log({ savedHotelCodesLength: savedHotelCodes.length });
        process.exit(0);
    }
}

async function removeDuplicates() {
    let totalDuplicates = 0;
    try {
        await connectionMongoDb(MongoUrl());
        const hotelCodes = await StaticHotel.find().distinct("HotelCode");
        console.dir({ hotelCodes: hotelCodes.length }, { depth: null });
        for (let code of hotelCodes) {
            const hotels = await StaticHotel.find({ HotelCode: code });
            if (hotels.length > 1) {
                console.log(`found ${hotels.length - 1} duplicates`);
                const hotelsToRemove = [];
                for (let i = 1; i < hotels.length; i++)
                    hotelsToRemove.push(hotels[i]._id);
                totalDuplicates += hotelsToRemove.length;
                // await StaticHotel.deleteMany({ _id: { $in: hotelsToRemove } });
                console.log(`removed ${hotelsToRemove.length} hotels`);
            }
        }

    } catch (error) {
        console.log({ error })
    } finally {
        console.log({ totalDuplicates })
        process.exit();
    }
}

hotelSeeder();