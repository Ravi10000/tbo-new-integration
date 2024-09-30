import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class CancelBookingStatusService {
  static async cancelBookingStatus(request: any, creds: ITBOCreds) {
    try {
      const requestBody = {
        ChangeRequestId: request.requestId,
        EndUserIp: "192.168.9.119",
        TokenId: creds.TOKEN_ID
      };
      const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].CANCEL_BOOKING_STATUS, requestBody, {
        auth: {
          username: creds.USERNAME,
          password: creds.PASSWORD
        }
      });
      let status = "Pending";
      switch (response.HotelChangeRequestResult.ChangeRequestStatus) {
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
          data: response,
          status: 200,
          description: `Booking Status - ${status}`
        }
      }
    } catch (error: any) {
      console.log({ error });
      return { error: error.message };
    }
  }
}

export default CancelBookingStatusService;