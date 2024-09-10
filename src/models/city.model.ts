import { Schema, model } from "mongoose";


export interface ICity {
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
});

export default model<ICity>("City", citySchema)