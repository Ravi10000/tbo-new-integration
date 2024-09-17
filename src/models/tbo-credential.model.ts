import dayjs from "dayjs";
import { Schema, model } from "mongoose";

const tboCredentialSchema = new Schema({
    companyId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        default: ""
    },
    tokenValidTillDateTime: Date
}, { timestamps: true });

const TBOCredential = model("TBOCredential", tboCredentialSchema);
export default TBOCredential;