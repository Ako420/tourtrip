import Link from "next/link";
import { formatShortDate, toFlightQuery } from "@/lib";
import type { FlightOffer, FlightSearch } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import Icon from "../ui/Icon";

type FlightTripCardProps = {
  offer: FlightOffer;
  search: FlightSearch;
  changeable?: boolean;
};

const FlightTripCard = ({ offer, search, changeable = false }: FlightTripCardProps) => {
  const legs = offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound];

  return (
    <section className="rounded-card bg-surface p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold">Trip to {search.to}</h2>
        {changeable && (
          <Link href={`/flights/results?${toFlightQuery(search)}`} className="text-sm text-primary hover:underline">
            Change flight
          </Link>
        )}
      </div>

      <div className="mt-3 rounded-card border border-line p-4">
        <p className="flex items-center gap-2 text-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="plane" className="text-tiny" />
          </span>
          <span className="font-semibold">{offer.airline}</span>
          <span className="text-ink-soft">
            {offer.flightNumber} · {offer.cabin}
          </span>
        </p>

        <ul className="mt-3 flex flex-col gap-3">
          {legs.map((leg) => (
            <li key={`${leg.from}-${leg.date}`}>
              <p className="mb-1 text-sm font-medium">{formatShortDate(leg.date)}</p>
              <FlightLegRow leg={leg} showDate={false} large />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FlightTripCard;
