import { destructBookingId } from "../../core/book.helper";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class CancelBookingService {
  static async cancelBooking(request: any, creds: ITBOCreds) {
    try {
      const { bookingId } = destructBookingId(request.bookingReference)
      const requestBody = {
        BookingMode: 5,
        RequestType: 4,
        Remarks: "Cancel Booking",
        BookingId: bookingId,
        EndUserIp: "192.168.9.119",
        TokenId: creds.TOKEN_ID
      };
      const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].CANCEL_BOOKING, requestBody, {
        auth: {
          username: creds.USERNAME,
          password: creds.PASSWORD
        }
      });
      return {
        result: {
          data: response,
          status: 200,
          description: "Cancellation in process"
        }
      }
    } catch (error: any) {
      console.log({ error });
      return { error: error.message };
    }
  }
}

export default CancelBookingService;