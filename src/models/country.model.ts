import { Schema, model } from "mongoose";

export interface ICountry {
    Code: string;
    Name: string;
}

const countrySchema = new Schema({
    Code: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
});

const Country = model<ICountry>("Country", countrySchema)
export default Country;