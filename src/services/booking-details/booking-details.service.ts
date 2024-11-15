import { constructBookingId, destructBookingId } from "../../core/book.helper";
import { IBookingDetailsRequest } from "../../interfaces/booking-details.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { generateBasicAuth } from "../../utils/generate-basic-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class BookingDetailsService {
    static async getBookingDetails(request: IBookingDetailsRequest, creds: ITBOCreds) {
        try {
            const { bookingId } = destructBookingId(request.bookingReference);
            const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].BOOKING_DETAILS, {
                EndUserIp: "192.168.9.119",
                TokenId: creds.TOKEN_ID,
                BookingId: bookingId
            }, {
                headers: {
                    Authorization: generateBasicAuth(creds.USERNAME, creds.PASSWORD)
                }
                // auth: {
                //     username: creds.USERNAME,
                //     password: creds.PASSWORD,
                // }
            });
            const isConfirmed = response.GetBookingDetailResult?.HotelBookingStatus === "Confirmed";
            const bookingDetailsRS = {
                bookingReference: request.bookingReference,
                confirmation: isConfirmed ? response.GetBookingDetailResult?.ConfirmationNo : null,
                availabilityType: null,
                errorMessage: response?.GetBookingDetailResult?.Error?.ErrorMessage ?? null,
                type: isConfirmed ? "booked" : "not-booked",
            }
            return { bookingDetailsRS };
        } catch (error: any) {
            console.log({ error });
            return { error: error.message };
        }
    }
}

export default BookingDetailsService;