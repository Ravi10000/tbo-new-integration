export function MongoUrl() {
    return `mongodb://localhost:27017/microservices`;
    // return `mongodb+srv://hsbhandari:DDUTUgxbWLOvd5Of@tcil.a6wowsv.mongodb.net/microservices`;
}

export function getBaseUrl(vendorCode: string) {
    switch (vendorCode) {
        case '1A':
            return 'http://localhost:5000'; // dev     
        case '6E':
            return 'http://localhost:5001';   //dev     tcilapi.traversia.net:5001 
    }


}