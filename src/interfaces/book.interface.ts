import { IPrebookRequest, IPrebookResponse } from "./prebook.interface";

export interface IBookRequest extends IPrebookRequest { }

export interface ITBOBookResult {
    VoucherStatus: boolean;
    ResponseStatus: number;
    Error: {
        ErrorCode: number;
        ErrorMessage: string;
    };
    TraceId: string;
    Status: number;
    HotelBookingStatus: string;
    InvoiceNumber: string;
    ConfirmationNo: string;
    BookingRefNo: string;
    BookingId: string;
    IsPriceChanged: boolean;
    IsCancellationPolicyChanged: boolean;
}

export interface IBookResult {
    id: string | null;
    type: "booked" | "not-booked";
    isHold: boolean;
    prebookRS: IPrebookResponse;
    errorMessage: string | null;
    availabilityType: string | null;
    confirmation: string | null;
}