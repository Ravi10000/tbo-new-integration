import { IRoomRate, ITBORoom } from "../interfaces/search.interface";

export function generateRoomResponse(room: ITBORoom, hotelCode: string, resultIndex: string, roomIdx: number): IRoomRate[] {
    const roomPrice = room.TotalFare / (room.Name.length);
    const roomTax = roomPrice - (room.TotalTax / room.Name.length);
    const roomRates = room.Name.map((name: string, idx) => {
        const id = [hotelCode, resultIndex, roomIdx, idx].join("|");
        console.log({ id, hotelCode, resultIndex, roomIdx, idx });
        return {
            RoomID: id,
            RoomName: name,
            RoomTypeCode: id,
            RoomDescription: null,
            Room_Reference: null,
            Images: null,
            Guests: [],
            Inclusions: room.Inclusion ? room.Inclusion.split(",").map((inclusion: string) => inclusion) : null,
            Rates: [
                {
                    TotalPrice: roomPrice,
                    BasePrice: roomPrice - roomTax,
                    Taxes: roomTax,
                    TaxBreakup: [
                        {
                            Type: "Tax",
                            Amount: roomTax
                        },
                        {
                            Type: "ServiceCharge",
                            Amount: 0.0
                        },
                        {
                            Type: "ServiceTax",
                            Amount: 0.0
                        },
                        {
                            Type: "OtherCharges",
                            Amount: 0.0
                        }
                    ],
                    AdditionalGuestAmount: 0,
                    Commission: {
                        Amount: 0,
                        TaxOnCommission: 0,
                        TaxType: null,
                        NetCommission: 0,
                        HotelTaxIncluded: null,
                        Percent: 0
                    },
                    Markup: 0,
                    Commercial: null,
                    B2bCommercial: null
                }
            ],
            CancelPenalties: [],
            HotelComments: [],
        }
    }) as IRoomRate[];
    return roomRates;
}