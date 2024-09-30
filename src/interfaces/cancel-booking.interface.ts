export interface ITBOCancelBookingResponse {
    HotelChangeRequestResult: {
        B2B2BStatus: boolean;
        CancellationChargeBreakUp: any;
        TotalServiceCharge: number;
        ResponseStatus: number;
        Error: {
            ErrorCode: number;
            ErrorMessage: string;
        };
        TraceId: string;
        ChangeRequestId: number;
        ChangeRequestStatus: number
    }
}