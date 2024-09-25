import { ITBOBookResult } from "../interfaces/book.interface";

export function constructBookingId(booking: ITBOBookResult) {
    return [
        booking.VoucherStatus,
        booking.TraceId,
        booking.Status,
        booking.HotelBookingStatus,
        booking.InvoiceNumber,
        booking.ConfirmationNo,
        booking.BookingRefNo,
        booking.BookingId
    ].join("||");
}
export function destructBookingId(bookingIdString: string) {
    const [
        voucherStatus,
        traceId,
        status,
        hotelBookingStatus,
        invoiceNumber,
        confirmationNo,
        bookingRefNo,
        bookingId
    ] = bookingIdString.split("||");
    return {
        voucherStatus,
        traceId,
        status,
        hotelBookingStatus,
        invoiceNumber,
        confirmationNo,
        bookingRefNo,
        bookingId
    }
}