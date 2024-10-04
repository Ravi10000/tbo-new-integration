// import { MongoUrl } from "../config/config";
// import { connectionMongoDb } from "../config/connection";
import City from "../models/city.model";
import Country from "../models/country.model";
import { TBO, TBO_ENDPOINTS } from "../utils/tbo.req";

export async function countriesAndCitiesSeeder() {
    try {
        // await connectionMongoDb(MongoUrl());
        const cityCount = await City.countDocuments();
        if (cityCount > 0)
            throw new Error("cities already exists");
        const countryCount = await Country.countDocuments();
        if (countryCount > 0)
            throw new Error("countries already exists");

        const { data: countryListResponse } = await TBO.get(TBO_ENDPOINTS.TEST.COUNTRY_LIST);
        await Country.insertMany(countryListResponse.CountryList)
        for (let country of countryListResponse.CountryList) {
            const { data: cityResponse } = await TBO.post(TBO_ENDPOINTS.TEST.CITY_LIST,
                { CountryCode: country.Code });
            cityResponse.CityList = cityResponse.CityList.map((city: any) => ({ ...city, CountryCode: country.Code }));
            await City.insertMany(cityResponse.CityList);
            console.log(`successfully inserted cities for ${country.Name}`)
        }
    } catch (error: any) {
        console.error(`Error seeding cities & country: ${error.message}`);
    } finally {
        process.exit(0);
    }
}
