import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
const envPath = resolve(dirname(dirname(__dirname)), ".env");
dotenv.config({
    path: envPath
})
export const env = dotenv;
export function MongoUrl() {
    return "mongodb+srv://rsharma:PDtLo80mXBoJZOoi@cluster0.uso8d.mongodb.net/tbo?retryWrites=true&w=majority&appName=Cluster0";
    // return `mongodb://localhost:27017/tbo`;
}

export function getBaseUrl(vendorCode: string) {
    switch (vendorCode) {
        case '1A':
            return 'http://localhost:5000'; // dev     
        case '6E':
            return 'http://localhost:5001';   //dev     tcilapi.traversia.net:5001 
    }


}