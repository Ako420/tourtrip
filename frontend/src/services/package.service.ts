import { randomUUID } from "node:crypto";
import { buildFlightOffers, hotels, packagesContent } from "@/data";
import { buildPackageOffer, checkRoom, getSeatProblem, toPackageFlightSearch, toPackageQuery, toPackageStay } from "@/lib";
import type {
  BookingResponse,
  FlightOffer,
  HotelDetails,
  PackageBookingRequest,
  PackageFlightChoice,
  PackageOffer,
  PackageSearch,
  PackageSearchResult,
  PackageSelection,
  PackagesContent,
} from "@/types";
import { ApiError, apiGet, apiPost, isApiEnabled } from "./http";

const toParams = (search: PackageSearch) => Object.fromEntries(new URLSearchParams(toPackageQuery(search)));

const getTravelMinutes = (flight: FlightOffer) => {
  return flight.outbound.durationMinutes + (flight.inbound?.durationMinutes ?? 0);
};

const getBookableFlights = (search: PackageSearch) => {
  return buildFlightOffers(toPackageFlightSearch(search)).filter((flight) => !getSeatProblem(flight, search));
};

const getFlightChoices = (flights: FlightOffer[]) => {
  const cheapest = flights.toSorted((a, b) => Number(a.totalPrice) - Number(b.totalPrice));
  const choices: PackageFlightChoice[] = [
    { label: "Cheapest", flight: cheapest[0] },
    { label: "Nonstop", flight: cheapest.find((flight) => flight.outbound.stops === 0) as FlightOffer },
    { label: "Fastest", flight: flights.toSorted((a, b) => getTravelMinutes(a) - getTravelMinutes(b))[0] },
  ];

  return choices.filter(({ flight }, index) => {
    return flight && choices.findIndex((choice) => choice.flight?.id === flight.id) === index;
  });
};

const getCheapestRoom = (hotel: HotelDetails, search: PackageSearch) => {
  return hotel.rooms
    .filter((room) => !checkRoom(hotel, room.id, toPackageStay(search)).problem)
    .toSorted((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight))[0];
};

export const getPackagesContent = async (): Promise<PackagesContent> => {
  return isApiEnabled ? apiGet<PackagesContent>("/packages/content") : packagesContent;
};

export const searchPackages = async (search: PackageSearch, flightId: string): Promise<PackageSearchResult> => {
  if (isApiEnabled) {
    return apiGet<PackageSearchResult>("/packages/search", { ...toParams(search), flight: flightId || undefined });
  }

  const flights = getBookableFlights(search);
  const flightChoices = getFlightChoices(flights);
  const selectedFlight = flightChoices.find(({ flight }) => flight.id === flightId)?.flight ?? flightChoices[0]?.flight;
  const destination = search.to?.trim().toLowerCase();

  if (!selectedFlight) {
    return { flightChoices, offers: [] };
  }

  const offers = hotels
    .filter((hotel) => hotel.city.toLowerCase() === destination)
    .flatMap((hotel) => {
      const room = getCheapestRoom(hotel, search);

      return room ? [buildPackageOffer(hotel, room, selectedFlight, search)] : [];
    })
    .toSorted((a, b) => a.totalPrice - b.totalPrice);

  return { flightChoices, selectedFlightId: selectedFlight.id, offers };
};

export const getPackageOffer = async (
  search: PackageSearch,
  { flightId, hotelSlug, roomId }: PackageSelection,
): Promise<PackageOffer | null> => {
  if (!isApiEnabled) {
    const flight = getBookableFlights(search).find((item) => item.id === flightId);
    const hotel = hotels.find((item) => item.slug === hotelSlug);
    const room = hotel && checkRoom(hotel, roomId, toPackageStay(search)).room;

    return flight && hotel && room ? buildPackageOffer(hotel, room, flight, search) : null;
  }

  try {
    return await apiGet<PackageOffer>("/packages/offer", { ...toParams(search), flightId, hotelSlug, roomId });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createPackageBooking = async (booking: PackageBookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/packages/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
