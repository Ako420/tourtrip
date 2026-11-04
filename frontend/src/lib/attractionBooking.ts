import { ticketLimits } from "@/constants";
import type { AttractionBookingTrip, RouteParams, TicketOption } from "@/types";
import { isIsoDate } from "./dates";

const getText = (value: RouteParams[string]) => (Array.isArray(value) ? value[0] : value) ?? "";

const getCount = (value: string, fallback: number, { min, max }: { min: number; max: number }) => {
  const count = Number.parseInt(value, 10);

  return Number.isNaN(count) ? fallback : Math.min(Math.max(count, min), max);
};

export const parseAttractionBooking = (slug: string, params: RouteParams) => {
  const date = getText(params.date);
  const trip: AttractionBookingTrip = {
    slug,
    ticketId: getText(params.ticket),
    date: isIsoDate(date) ? date : "",
    adults: getCount(getText(params.adults), 1, ticketLimits.adults),
    children: getCount(getText(params.children), 0, ticketLimits.children),
  };

  return { trip, reference: getText(params.reference) };
};

export const getTicketTotal = (ticket: TicketOption, trip: Pick<AttractionBookingTrip, "adults" | "children">) => {
  return Number(ticket.adultPrice) * trip.adults + Number(ticket.childPrice) * trip.children;
};
