import { IRoomType, ISearchRequest } from "./search.interface";
export interface IDetailsRequest extends ISearchRequest {
    supplierId: string;
    hotelCode: string;
}

export interface IDetailsResponse {
    checkInTime: string;
    checkOutTime: string;
    searchId: string;
    supplierId: string;
    hotelPicture: string;
    isHotDeal: boolean;
    hotelRating: number;
    code: string;
    address: string;
    name: string;
    categoryCode: string | null;
    categoryName: string | null;
    latitude: string;
    longitude: string;
    minRate: null | number;
    maxRate: null | number;
    currency: null | string;
    description: string;
    totalPrice: number;
    imagePath: string;
    resultIndex: string;
    hotelLocation: null | string;
    roomTypes: IRoomType[];
}