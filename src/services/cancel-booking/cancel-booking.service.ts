import { destructBookingId } from "../../core/book.helper";
import { ITBOCancelBookingResponse } from "../../interfaces/cancel-booking.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { generateBasicAuth } from "../../utils/generate-basic-auth";
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
        headers: {
          Authorization: generateBasicAuth(creds.USERNAME, creds.PASSWORD)
        }
        // auth: {
        //   username: creds.USERNAME,
        //   password: creds.PASSWORD
        // }
      }) as { data: ITBOCancelBookingResponse };
      // const status = {
      //   "0": "NotSet",
      //   "1": "Pending",
      //   "2": "InProgress",
      //   "3": "Processed",
      //   "4": "Rejected"
      // }
      let status = "Pending";
      switch (response?.HotelChangeRequestResult?.ChangeRequestStatus) {
        case 0:
        case 1:
          status = "Pending";
          break;
        case 2:
          status = "In Progress";
          break;
        case 3:
          status = "Processed";
          break;
        case 4:
          status = "Rejected";
          break;
      }
      return {
        result: {
          status: 200,
          requestId: response?.HotelChangeRequestResult?.ChangeRequestId ?? null,
          description: `Booking Status - ${status}`,
        }
      }
    } catch (error: any) {
      console.log({ error });
      return { error: error.message };
    }
  }
}

export default CancelBookingService;