import { guestLimits, PACKAGE_DISCOUNT } from "@/constants";
import type {
  FlightOffer,
  FlightSearch,
  HotelRoom,
  HotelSummary,
  PackageOffer,
  PackageSearch,
  PackageSelection,
  RouteParams,
} from "@/types";
import { getStayTotal } from "./booking";
import { parseFlightSearch } from "./flightSearch";

const getText = (value: RouteParams[string]) => (Array.isArray(value) ? value[0] : value) ?? "";

export const parsePackageSearch = (params: RouteParams): PackageSearch => {
  const { from, to, departDate, returnDate, adults, children, cabin } = parseFlightSearch(params);
  const rooms = Number.parseInt(getText(params.rooms), 10);

  return {
    from,
    to,
    departDate,
    returnDate,
    adults,
    children,
    cabin,
    rooms: Number.isNaN(rooms) ? guestLimits.rooms.min : Math.min(Math.max(rooms, guestLimits.rooms.min), guestLimits.rooms.max),
  };
};

export const parsePackageSelection = (params: RouteParams): PackageSelection => {
  return { flightId: getText(params.flight), hotelSlug: getText(params.hotel), roomId: getText(params.room) };
};

export const parsePackageReference = (params: RouteParams) => getText(params.reference);

export const toPackageQuery = (search: PackageSearch) => {
  const query = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const toPackageFlightSearch = (search: PackageSearch): FlightSearch => {
  const { from, to, departDate, returnDate, adults, children, cabin } = search;

  return { from, to, departDate, returnDate, adults, children, cabin, tripType: "round-trip", isNonstop: false };
};

export const toPackageStay = ({ to, departDate, returnDate, rooms, adults, children }: PackageSearch) => {
  return { destination: to, checkIn: departDate, checkOut: returnDate, rooms, adults, children };
};

export const toPackageBookHref = (search: PackageSearch, { flight, hotel, room }: PackageOffer) => {
  const query = new URLSearchParams(toPackageQuery(search));

  query.set("flight", flight.id);
  query.set("hotel", hotel.slug);
  query.set("room", room.id);

  return `/packages/book?${query}`;
};

// The discount is worked out here from both full prices, so a package always costs less than its parts.
export const buildPackageOffer = (
  hotel: HotelSummary,
  room: HotelRoom,
  flight: FlightOffer,
  search: PackageSearch,
): PackageOffer => {
  const flightTotal = Number(flight.totalPrice);
  const hotelTotal = getStayTotal(room, toPackageStay(search));
  const regularTotal = flightTotal + hotelTotal;
  const discount = Math.round(regularTotal * PACKAGE_DISCOUNT);

  return {
    hotel,
    room,
    flight,
    flightTotal,
    hotelTotal,
    regularTotal,
    discount,
    totalPrice: regularTotal - discount,
    currency: flight.currency,
  };
};
