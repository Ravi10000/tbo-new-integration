import logger from '../utils/logger';

export function getVendorList(SystemEntity: any, SystemName: any, CredentialType: string, CorpCode: string) {
    const credentials = {
        "Success": true,
        "Status": 200, // Corrected typo 'Staus' to 'Status'
        "Message": "Search result retrieved",
        "Data": {
            "systemEntity": "TCIL",
            "systemName": "Astra2.0",
            "credentialType": "TEST",
            "corpCode": "XYXYXYYX",
            "vendorList": [
                {
                    "vendorCode": "1A",
                    "credential": {
                        "userId": "WSTCIEPT",
                        "password": "AMADEUS100",
                        "pseudoCityCode": "BOMTC28OJ",
                        "wSAP_TargetBranch": "1ASIWEPTTCI",
                        "accountNumber": ""
                    },
                    "dealCodes": [
                        {
                            "airlineCode": "AI",
                            "dealCode": "644386",
                            "dealCodeType": "Corporate"
                        },
                        {
                            "airlineCode": "UK",
                            "dealCode": "KAJUSHH",
                            "dealCodeType": "TMC"
                        }
                    ],
                    "fareTypes": [
                        "RP",
                        "RF",
                        "RU",
                        "TAC",
                        "ET",
                        "XND"
                        //"RW"
                    ],
                    "productClass": null,
                    "includeAirlines": ["AI", "UK"],
                    "excludeAirlines": []
                },
                {
                    "vendorCode": "6E",
                    "credential": {
                        "userId": "DELWI2152",
                        "password": "Indigo@2024",
                        "pseudoCityCode": "",
                        "wSAP_TargetBranch": "OTI110",
                        "accountNumber": ""
                    },
                    "dealCodes": [
                        {
                            "airlineCode": "6E",
                            "dealCode": "CUITYCW",
                            "dealCodeType": "Corporate"
                        }
                    ],
                    "fareTypes": [
                        "R",
                        "Z",
                        "F"
                    ],
                    "productClass": [
                        "R",
                        "A",
                        "J",
                        "S",
                        "B",
                        "M",
                        "Z",
                        "F"
                    ],
                    "includeAirlines": [],
                    "excludeAirlines": []
                }
            ]
        }
    };

    // Check if credentials, credentials.Data, and credentials.Data.vendorList exist
    if (credentials && credentials.Data && Array.isArray(credentials.Data.vendorList)) {
        return credentials.Data.vendorList;
    }

    // Return an empty array if conditions are not met
    return [];
}

export const maxTimeLimit = 40000; // in miliseconds

const definedAirlines = ["6E","SG","QP","IX","I5"];

export function requestHeader(requestHeader: any) {
    const header = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2UxciIsImlhdCI6MTcyMDc3MzE5MiwiZXhwIjoxNzIwNzc2NzkyfQ.RUZlbSpG4fDtc7ljZcVebhyc8phxDj10oaaDR7ghwLQewewevcwe',
        'Content-Type': 'application/json'
    };
    return header;
}

export function requestBody(requestBody: any, vendor: any) {
    // Ensure vendorList is initialized as an array if it doesn't exist
    requestBody.vendorList = requestBody.vendorList || [];
    console.log(vendor.credential)
    // Add the vendor to the vendorList
    requestBody.vendorList = [{
        vendorCode: vendor.vendorCode,
        credential: {
            userId: vendor.credential.userId,
            password: vendor.credential.password,
            pseudoCityCode: vendor.credential.pseudoCityCode,
            wSAP_TargetBranch: vendor.credential.wSAP_TargetBranch,
            accountNumber: vendor.credential.accountNumber
        },
        corporatedealCode: vendor.dealCodes,
        fareTypes: vendor.fareTypes,
        productClass: vendor.productClass,
        includeAirlines: vendor.includeAirlines,
        excludeAirlines: vendor.excludeAirlines
    }];

    return requestBody;
}

export function filterVendorList(vendorList:any,airlines:any){
    const vendorCodes = new Set();
    let hasDefinedAirlines = false;

    for (const airline of airlines) {
        if (definedAirlines.includes(airline)) {
            vendorCodes.add(airline);
            hasDefinedAirlines = true;
        }else{
            vendorCodes.add('1A');
        }
    }
    const filteredVendorList = vendorList.filter((vendor:any) =>
        vendorCodes.has(vendor.vendorCode)
    );

    filteredVendorList.find((vendor:any) => {
        if(vendor.vendorCode === '1A'){
            if (vendor.excludeAirlines && vendor.excludeAirlines!==null && vendor.excludeAirlines.length > 0) {
                const excludeAirlinesSet = new Set(vendor.excludeAirlines);
                const updatedIncludeAirlines = [...vendor.includeAirlines];
            
                airlines.forEach((airline:any) => {
                    if(airline !="6E"){
                        if (!excludeAirlinesSet.has(airline)) {
                            logger.info(`The airline value ${airline} is not in excludeAirlinesSet`);  
                            if (!updatedIncludeAirlines.includes(airline)) {
                                updatedIncludeAirlines.push(airline);
                            }
                        }else{
                            logger.info(`The airline value ${airline} is in excludeAirlinesSet`);   
                        }
                    }  
                });
                vendor.includeAirlines = updatedIncludeAirlines;
            } else {
                const updatedIncludeAirlines:any = [];
                airlines.forEach((airline:any) => {
                    if(airline !="6E"){
                        updatedIncludeAirlines.push(airline);
                        vendor.excludeAirlines =[];
                    }
                });
                // console.log(updatedIncludeAirlines,"updatedIncludeAirlines")
                vendor.includeAirlines = updatedIncludeAirlines;
            }    
        }
    });

    return filteredVendorList;
}

function validateType(value: any, expectedType: string): boolean {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (expectedType === 'any') return true;
    return actualType === expectedType;
}

// function validateObject(obj: any, schema: any, path: string[] = []): string[] {
//     const errors: string[] = [];
    
//     for (const [key, expectedType] of Object.entries(schema)) {
//         const currentPath = [...path, key].join('.');
//         const value = obj[key];

//         if (expectedType === 'array') {
//             if (!Array.isArray(value)) {
//                 errors.push(`Expected array at ${currentPath}`);
//             } else if (value.length > 0) {
//                 // Validate first element schema for array
//                 const elementSchema = (schema[key] as any[])[0];
//                 value.forEach((item, index) => {
//                     errors.push(...validateObject(item, elementSchema, [...path, key, index.toString()]));
//                 });
//             }
//         } else if (typeof expectedType === 'object' && !Array.isArray(expectedType)) {
//             if (typeof value !== 'object' || value === null) {
//                 errors.push(`Expected object at ${currentPath}`);
//             } else {
//                 errors.push(...validateObject(value, expectedType, [...path, key]));
//             }
//         } else if (!validateType(value, expectedType)) {
//             errors.push(`Expected ${expectedType} at ${currentPath}, but got ${typeof value}`);
//         }
//     }
    
//     return errors;
// }

// export function validateResponse(response: any,schema:any): string[] {
//     return validateObject(response, schema);
// }
