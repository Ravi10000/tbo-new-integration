import { constructBookingId } from "../../core/book.helper";
import { IBookRequest, IBookResult } from "../../interfaces/book.interface";
import { IPrebookResponse } from "../../interfaces/prebook.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { generateBasicAuth } from "../../utils/generate-basic-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class BookService {
    static async bookHotel(request: IPrebookResponse, creds: ITBOCreds) {
        console.log({ creds })
        try {
            let paxId = 0;
            const requestBody = {
                BookingCode: request.roomDetails[0].roomTypes.roomTypeCode,
                IsVoucherBooking: !request.isHold,
                GuestNationality: "IN",
                EndUserIp: "192.168.9.119",
                NetAmount: request.netAmount,
                HotelRoomsDetails: request.roomDetails[0].roomTypes.roomRates.map((details, idx) => ({
                    HotelPassenger: details.guests.map((guest, guestIdx) => ({
                        Title: guest.title,
                        FirstName: guest.firstName,
                        MiddleName: guest.middleName ?? "",
                        LastName: guest.lastName,
                        Email: guest.email,
                        PaxType: guest.guestType === "ADT" ? 1 : 2,
                        LeadPassenger: guestIdx === 0,
                        // Age: guest.age ?? 0,
                        // PassportNo: null,
                        // PassportIssueDate: null,
                        // PassportExpDate: null,
                        Phoneno: guest.contactNumber,
                        PaxId: paxId++,
                        GSTCompanyAddress: null,
                        GSTCompanyContactNumber: null,
                        GSTCompanyName: null,
                        GSTNumber: null,
                        GSTCompanyEmail: null,
                        // PAN: guest.panNumber ?? null
                    }))
                }))
            };
            const bookURL = TBO_ENDPOINTS[creds.TYPE].BOOK;
            const auth = {
                username: creds.USERNAME,
                password: creds.PASSWORD
            };
            console.dir({ bookURL, requestBody, auth }, { depth: null });
            const { data: response } = await TBO.post(bookURL, requestBody, {
                headers: {
                    Authorization: generateBasicAuth(creds.USERNAME, creds.PASSWORD)
                }
            });
            console.log({ response });
            const isConfirmed = response.BookResult?.HotelBookingStatus === "Confirmed";
            const bookRS = {
                bookingReference: isConfirmed ? constructBookingId(response.BookResult) : null,
                confirmation: isConfirmed ? response.BookResult?.ConfirmationNo : null,
                availabilityType: null,
                errorMessage: response?.BookResult?.Error?.ErrorMessage ?? null,
                prebookRS: request,
                isHold: request.isHold,
                type: isConfirmed ? "booked" : "not-booked",
            } as IBookResult;
            return { bookRS };
        } catch (err: any) {
            console.log({ err });
            return { error: err.message }
        }
    }
}

export default BookService;