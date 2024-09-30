import { constructBookingId, destructBookingId } from "../../core/book.helper";
import { IBookResult } from "../../interfaces/book.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class VoucherBooking {
    static async voucherBooking(request: any, creds: ITBOCreds) {
        try {
            const { bookingId } = destructBookingId(request.bookingReference)
            const requestBody = {
                EndUserIp: "192.168.9.119",
                BookingId: bookingId,
            };
            console.dir({ requestBody }, { depth: null });
            const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].GENERATE_VOUCHER,
                requestBody, {
                auth: {
                    username: creds.USERNAME,
                    password: creds.PASSWORD,
                }
            });
            const isConfirmed = response.GenerateVoucherResult?.HotelBookingStatus === "Confirmed";
            const result = {
                bookingReference: isConfirmed ? constructBookingId(response.GenerateVoucherResult) : null,
                confirmation: isConfirmed ? response.GenerateVoucherResult?.ConfirmationNo : null,
                availabilityType: null,
                errorMessage: response?.GenerateVoucherResult?.Error?.ErrorMessage ?? null,
                prebookRS: request,
                isHold: true,
                type: isConfirmed ? "booked" : "not-booked",
            } as IBookResult;
            return { result };
        } catch (error: any) {
            // console.log({ error });
            console.dir({ request: error?.response?.request }, { depth: null })
            return { error: "Something went wrong while generating voucher" };
        }
    }
}

export default VoucherBooking;