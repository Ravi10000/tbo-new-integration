import { Document, Schema, model } from "mongoose";


export interface ICity extends Document {
    Code: string;
    Name: string;
}

const citySchema = new Schema({
    Code: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    CountryCode: {
        type: String,
        required: true
    }
});

const City = model<ICity>("City", citySchema)
export default City;