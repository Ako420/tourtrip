import type { HotelDetails, HotelRoom, HotelSearch, RouteParams } from "@/types";
import { nightsBetween } from "./dates";

type BookableStay = {
  checkIn?: string;
  checkOut?: string;
  rooms: number;
  adults: number;
  children: number;
};

type RoomCheck = { room: HotelRoom; problem?: undefined } | { room?: undefined; problem: string };

const getText = (value: RouteParams[string]) => (Array.isArray(value) ? value[0] : value) ?? "";

export const parseBookingParams = (params: RouteParams) => {
  return { roomId: getText(params.room), reference: getText(params.reference) };
};

export const checkRoom = (hotel: HotelDetails, roomId: string, stay: BookableStay): RoomCheck => {
  const room = hotel.rooms.find((item) => item.id === roomId);

  if (!room) return { problem: "This room could not be found." };
  if (!room.isAvailable) return { problem: "This room has just sold out." };
  if (!stay.checkIn || !stay.checkOut || stay.checkOut <= stay.checkIn) {
    return { problem: "Choose your check-in and check-out dates first." };
  }
  if (stay.adults + stay.children > room.maxGuests * stay.rooms) {
    return { problem: "This room is too small for your group. Add a room or choose a larger one." };
  }

  return { room };
};

export const getLowestRoom = (hotel: HotelDetails) => {
  const rooms = hotel.rooms.filter((room) => room.isAvailable);

  return rooms.reduce<HotelRoom | undefined>(
    (lowest, room) => (!lowest || Number(room.pricePerNight) < Number(lowest.pricePerNight) ? room : lowest),
    undefined,
  );
};

export const getStayTotal = (room: HotelRoom, stay: Pick<HotelSearch, "checkIn" | "checkOut" | "rooms">) => {
  return Number(room.pricePerNight) * nightsBetween(stay.checkIn ?? "", stay.checkOut ?? "") * stay.rooms;
};
