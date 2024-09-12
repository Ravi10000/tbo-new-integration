import { Schema, model, Document } from "mongoose";

export interface ICountry extends Document {
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