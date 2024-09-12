import { IStaticHotel } from "../models/static-hotel.model";

export interface IRoom {
    Guests: IGuest[]
}

export interface IGuest {
    GuestType: string;
    GuestAge: number;
}

export interface IStaticHotelMap {
    [key: string]: IStaticHotel;
}
export interface ISearchRequest {
    Rooms: IRoom[];
    Authentication: {
        CompanyId: string;
        CredentialId: string;
        CredentialPassword: string;
        CredentialType: string;
        salesChannel: null | undefined | string;
        sessionID: null | undefined | string;
        // TraceId: null | undefined | string;
    };
    TypeOfTrip: string;
    Destination: {
        Location: null | undefined | string;
        ResignCode: null | undefined | string;
        CityCode: null | undefined | string;
        CityName: string;
        CountryCode: string;
        CountryName: string;
        State: string;
    };
    HotelCode: null | undefined | string;
    Check_In: string;
    Check_Out: string;
    BudgetAmountFrom: null | undefined | number;
    BudgetAmountTo: null | undefined | number;
    SearchID: null | string | number;
    ResultIndex: null | string | number;
    CancellationPolicyCode: null | string | number;
    RatePlanCode: null | string | number;
    Nationality: string;
    AccomodationType: null | string | number;
    StarRating: null | string | number;
    TotalItems: number;
    PageSize: number;
    PageNo: number;
    TotalPage: number;
    SessId: null | string | undefined;
    RateType: null | string | undefined;
    purpose_of_travel: null | string | number;
}

export interface IPaxRoom {
    Adults: number;
    Children: number;
    ChildrenAges: number[] | null
}

export interface ITBORoom {
    Name: string[];
    BookingCode: string;
    Inclusion: string;
    DayRates: { BasePrice: number; }[];
    TotalFare: number;
    TotalTax: number;
    CancelPolicies: {
        FromDate: string;
        ChargeType: string;
        CancellationCharge: string;
    }[];
    RoomPromotion: string[] | undefined;
    MealType: string;
    IsRefundable: boolean;
    WithTransfers: boolean;
    BeddingGroup: string | undefined;
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
    IsPanCard: boolean;
    IsAdharCard: boolean;
    IsPassport: boolean;
    OtherID: boolean
}

export interface IRoomType {
    RoomTypeCode: string; // pipe(|) separated values
    RoomRates: IRoomRate[];
}
export interface IRoomRate {
    RoomID: string; // pipe(|) separated values
    RoomName: string;
    RoomTypeCode: string; // pipe(|) separated values
    RoomDescription: null;
    Room_Reference: null;
    Images: null;
    Guests: [];
    Rates: IRateObject[];
    CancelPenalties: string[];
    Inclusions: string[];
    HotelComments: string[]
}
export interface IRateObject {
    TotalPrice: number;
    BasePrice: number;
    Taxes: number;
    TaxBreakup: ITaxBreakup[];
    AdditionalGuestAmount: number;
    Commission: ICommission;
    Markup: number;
    Commercial: null;
    B2bCommercial: null;
}
export interface ICommission {
    Amount: number;
    TaxOnCommission: number;
    TaxType: null;
    NetCommission: number;
    HotelTaxIncluded: null;
    Percent: number;

}
export interface ITaxBreakup {
    Type: string;
    Amount: number;
}
export interface IHotelResponse {
    DocumentsRequired: null;
    searchID: string;
    AccommodationType: null;
    ChainName: null;
    supplierID: string;
    hotelPicture: string;
    isHotDeal: boolean;
    hotelRatings: number;
    code: string;
    address: string;
    name: string;
    categoryCode: string;
    categoryName: string;
    latitude: string;
    longitude: string;
    minRate: null;
    maxRate: null;
    currency: null | string;
    description: null | string;
    facilities: null | string[];
    totalPrice: number;
    resultIndex: string;
    hotelLocation: string;
    Refundable: boolean;
    RoomTypes: IRoomType[];
}