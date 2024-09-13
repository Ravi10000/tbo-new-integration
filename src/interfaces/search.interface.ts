import { IStaticHotel } from "../models/static-hotel.model";

export interface IRoom {
    guests: IGuest[]
}

export interface IGuest {
    guestType: string;
    guestAge: number;
}

export interface IStaticHotelMap {
    [key: string]: IStaticHotel;
}
export interface ISearchRequest {
    rooms: IRoom[];
    authentication: {
        companyId: string;
        credentialId: string;
        credentialPassword: string;
        credentialType: string;
        salesChannel: null | undefined | string;
        sessionId: null | undefined | string;
        // TraceId: null | undefined | string;
    };
    typeOfTrip: string;
    destination: {
        location: null | undefined | string;
        resignCode: null | undefined | string;
        cityCode: null | undefined | string;
        cityName: string;
        countryCode: string;
        countryName: string;
        state: string;
    };
    hotelCode: null | undefined | string;
    checkIn: string;
    checkOut: string;
    budgetAmountFrom: null | undefined | number;
    budgetAmountTo: null | undefined | number;
    searchId: null | string;
    resultIndex: null | string;
    cancellationPolicyCode: null | string;
    ratePlanCode: null | string;
    nationality: string;
    accommodationType: null | string;
    starRating: null | number;
    totalItems: number;
    pageSize: number;
    pageNo: number;
    totalPage: number;
    sessionId?: null | string;
    rateType?: null | string;
    purposeOfTravel: null | string;
}

export interface ITBOPaxRoom {
    Adults: number;
    Children: number;
    ChildrenAges: number[] | null
}

export interface ITBORoom {
    Name: string[];
    BookingCode: string;
    Inclusion: string;
    DayRates: DayRate[][];
    TotalFare: number;
    TotalTax: number;
    CancelPolicies: {
        FromDate: string;
        ChargeType: string;
        CancellationCharge: number;
    }[];
    RoomPromotion: string[] | undefined;
    MealType: string;
    IsRefundable: boolean;
    WithTransfers: boolean;
    BeddingGroup: string | undefined;
}
export interface DayRate {
    BasePrice: number;
}


export interface ITBOHotelRates {
    HotelCode: string;
    Currency: string;
    Rooms: ITBORoom[];
}
export interface ITBOInteraction {
    [key: string]: string;
}
export interface ITBOHotelDetails {
    HotelCode: string;
    HotelName: string;
    Description: string;
    HotelFacilities: string[];
    Attractions: ITBOInteraction;
    Images: string[];
    Address: string;
    PinCode: string;
    CityId: string;
    CountryName: string;
    PhoneNumber: string;
    FaxNumber: string;
    Map: string;
    HotelRating: string;
    CityName: string;
    CountryCode: string;
    CheckInTime: string;
    CheckOutTime: string;
}

export interface ITBOCombinedHotelDetails extends IStaticHotel, ITBOHotelRates { }

export interface IDocValidation {
    isPanCard: boolean;
    isAadhaarCard: boolean;
    isPassport: boolean;
    otherId: boolean
}

export interface IRoomType {
    roomTypeCode: string; // pipe(|) separated values
    roomRates: IRoomRate[];
}
export interface IRoomRate {
    roomId: string; // pipe(|) separated values
    roomName: string;
    roomTypeCode: string; // pipe(|) separated values
    roomDescription: null;
    roomReference: null;
    images: null;
    guests: [];
    rates: IRateObject[];
    cancelPenalties: CancelPenalty[];
    inclusions: Inclusion[] | null;
    hotelComments: string[];
}
export interface CancelPenalty {
    name: string;
    penaltyDescription: string;
    nonRefundable: boolean;
}
export interface Inclusion {
    boardingDetails: null | string;
    inclusionDescription: string;
}
export interface IRateObject {
    totalPrice: number;
    basePrice: number;
    taxes: number;
    taxBreakup: ITaxBreakup[];
    additionalGuestAmount: number;
    commission: ICommission;
    markup: number;
    commercial: null;
    b2bCommercial: null;
}
export interface ICommission {
    amount: number;
    taxOnCommission: number;
    taxType: null;
    netCommission: number;
    hotelTaxIncluded: null;
    percent: number;

}
export interface ITaxBreakup {
    type: string;
    amount: number;
}
export interface IHotelResponse {
    documentsRequired: null;
    searchId: string;
    accommodationType: null | string;
    chainName: null | string;
    supplierId: string;
    hotelPicture: string;
    isHotDeal: boolean;
    hotelRating: number;
    code: string;
    address: string;
    name: string;
    categoryCode: string;
    categoryName: string;
    latitude: string;
    longitude: string;
    minRate: null | number;
    maxRate: null | number;
    currency: null | string;
    description: null | string;
    facilities: null | string[];
    totalPrice: number;
    resultIndex: string;
    hotelLocation: string;
    refundable: boolean;
    roomTypes: IRoomType[];
}