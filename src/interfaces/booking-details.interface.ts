import { IAuthentication } from "./search.interface";

export interface IBookingDetailsRequest {
    bookingId: string;
    authentication: IAuthentication;
}