import { IPaxRoom, IRoom } from "../interfaces/search.interface";

export function generatePaxRooms(rooms: IRoom[]): IPaxRoom[] {
    const PaxRooms = [];
    for (let room of rooms) {
        let roomDetails: IPaxRoom = {
            Adults: 0,
            Children: 0,
            ChildrenAges: [],
        };
        for (let guest of room.Guests) {
            if (guest.GuestType === "ADT")
                roomDetails.Adults += 1;
            else {
                roomDetails.Children += 1;
                if (guest.GuestAge && roomDetails.ChildrenAges)
                    roomDetails.ChildrenAges.push(guest.GuestAge);
            }
        }
        if (!roomDetails?.ChildrenAges?.length) {
            roomDetails.ChildrenAges = null;
        }
        PaxRooms.push(roomDetails);
    }
    console.log({ PaxRooms })
    return PaxRooms;
}