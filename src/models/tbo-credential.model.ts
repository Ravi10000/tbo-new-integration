import { Schema, model } from "mongoose";

const tboCredentialSchema = new Schema({
    companyId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["TEST", "LIVE"],
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