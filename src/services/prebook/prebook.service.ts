import { IPrebookRequest, IPrebookResponse, ITBOValidations } from "../../interfaces/prebook.interface";
import { ITBOCreds } from "../../middleware/tbo-auth";
import { TBO, TBO_ENDPOINTS } from "../../utils/tbo.req";

class PrebookService {
    static async prebook(data: IPrebookRequest, creds: ITBOCreds) {
        const bookingCode = data.roomDetails[0].roomTypes.roomTypeCode;
        const { data: response } = await TBO.post(TBO_ENDPOINTS[creds.TYPE].PRE_BOOK, {
            BookingCode: bookingCode,
            PaymentMode: "Limit"
        }, {
            auth: {
                username: creds.USERNAME,
                password: creds.PASSWORD
            }
        });
        console.dir({ response }, { depth: null });

        const rooms = response?.HotelResult[0]?.Rooms?.[0] ?? response?.HotelResult?.Rooms?.[0];
        const availability = rooms?.BookingCode === bookingCode
            ? "confirm"
            : "not-available";
        const TBOValidations = response?.ValidationInfo;
        const validations: ITBOValidations = {
            isPanMandatory: TBOValidations?.PanMandatory ?? false,
            isPassportMandatory: TBOValidations?.PassportMandatory ?? false,
            isCorporateBookingAllowed: TBOValidations?.CorporateBookingAllowed ?? false,
            panCountRequired: TBOValidations?.PanCountRequired ?? 0,
            isSamePaxNameAllowed: TBOValidations.SamePaxNameAllowed ?? true,
            isSpaceAllowed: TBOValidations.SpaceAllowed ?? false,
            isSpecialCharAllowed: TBOValidations.SpecialCharAllowed ?? false,
            paxNameMinLength: TBOValidations?.PaxNameMinLength ?? 0,
            paxNameMaxLength: TBOValidations?.PaxNameMaxLength ?? 0,
            charLimit: TBOValidations.CharLimit ?? false,
            isPackageFare: TBOValidations.PackageFare ?? false,
            isPackageDetailsMandatory: TBOValidations.PackageDetailsMandatory ?? false,
            isDepartureDetailsMandatory: TBOValidations.DepartureDetailsMandatory ?? false,
            isGSTAllowed: TBOValidations.GSTAllowed ?? false,
        }
        const prebookResponse: IPrebookResponse = {
            ...data,
            netAmount: rooms.NetAmount,
            netTax: rooms.NetTax,
            availability,
            totalFare: rooms.TotalFare,
            totalTax: rooms.TotalTax,
            validations,
            isHold: data.isHold
        }
        return prebookResponse;
    }
}

export default PrebookService;