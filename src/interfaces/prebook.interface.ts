import { IAuthentication, IGuestDetail, IRoomRate } from "./search.interface";

export interface IPrebookRequest {
    authentication: IAuthentication;
    hotelCode: string;
    typeOfTrip: null | string;
    destination: string;
    address: string;
    hotelImage: string;
    starRating: number;
    hotelName: string;
    supplierId: string;
    resultIndex: string;
    searchId: string;
    roomDetails: IRoomDetail[];
    gstDetails: IGSTDetail;
    agencyInfo: any;
    checkIn: string;
    checkOut: string;
    uniqueId: string;
    specialRequest: string | null;
    basePrice: number;
    taxes: number;
    purposeOfTravel: number;
    corporateName: string;
}

export interface IGSTDetail {
    title: string | null;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string | null;
    homePhone: string | null;
    workPhone: string | null;
    gstNumber: string | null;
    companyName: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    provinceState: string | null;
    postalCode: string | null;
    countryCode: string | null;
}
export interface IRoomDetail {
    roomTypes: IRoomType;
    guests: IGuestDetail[];
}

export interface IRoomType {
    roomTypeCode: string;
    roomRates: IRoomRate[];
}