import { Schema, Model, model, Document } from "mongoose";

export interface IStaticHotel extends Document {
    HotelCode: string;
    HotelName: string;
    Description: string;
    HotelFacilities: string[],
    Attractions: {},
    Images: string[],
    Address: string;
    PinCode: string;
    CityId: string;
    CountryName: string;
    PhoneNumber: string;
    FaxNumber: string;
    Map: string;
    HotelRating: number,
    CityName: string;
    CountryCode: string;
    CheckInTime: string;
    CheckOutTime: string;
}
const staticHotelSchema = new Schema({
    HotelCode: String,
    HotelName: String,
    Description: String,
    HotelFacilities: {
        type: [String],
        default: []
    },
    Attractions: {},
    Images: {
        type: [String],
        default: []
    },
    Address: String,
    PinCode: String,
    CityId: String,
    CountryName: String,
    PhoneNumber: String,
    FaxNumber: String,
    Map: String,
    HotelRating: Number,
    CityName: String,
    CountryCode: String,
    CheckInTime: String,
    CheckOutTime: String
});

const StaticHotel = model<IStaticHotel>("StaticHotel", staticHotelSchema);
export default StaticHotel;