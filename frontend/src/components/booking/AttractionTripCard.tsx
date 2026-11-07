import { formatCount, formatShortDate } from "@/lib";
import type { AttractionBookingTrip, AttractionDetails, TicketOption } from "@/types";
import Icon from "../ui/Icon";

type AttractionTripCardProps = {
  attraction: AttractionDetails;
  ticket: TicketOption;
  trip: AttractionBookingTrip;
};

const AttractionTripCard = ({ attraction, ticket, trip }: AttractionTripCardProps) => {
  const guests = [formatCount(trip.adults, "adult")];

  if (trip.children > 0) {
    guests.push(formatCount(trip.children, "child", "children"));
  }

  return (
    <section className="rounded-card bg-surface p-5">
      <h2 className="text-xl font-bold">{attraction.name}</h2>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        <li className="flex items-center gap-2">
          <Icon name="calendar" className="w-4" />
          {formatShortDate(trip.date)} · {attraction.duration}
        </li>
        <li className="flex items-center gap-2">
          <Icon name="ticket" className="w-4" />
          {ticket.name}: {ticket.includes.join(", ")}
        </li>
        <li className="flex items-center gap-2">
          <Icon name="users" className="w-4" />
          {guests.join(", ")}
        </li>
        <li className="flex items-center gap-2">
          <Icon name="location" className="w-4" />
          {attraction.city}, {attraction.country}
        </li>
        {attraction.freeCancellation && (
          <li className="flex items-center gap-2 text-primary">
            <Icon name="check" className="w-4" />
            Free cancellation
          </li>
        )}
      </ul>
    </section>
  );
};

export default AttractionTripCard;
