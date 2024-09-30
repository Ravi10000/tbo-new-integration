import { IAuthentication } from "./search.interface";

export interface IBookingDetailsRequest {
    bookingReference: string;
    authentication: IAuthentication;
}