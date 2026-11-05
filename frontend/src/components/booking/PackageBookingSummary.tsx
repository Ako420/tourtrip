import { formatCount, formatPrice, formatShortDate, nightsBetween } from "@/lib";
import type { PackageOffer, PackageSearch } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import AppImage from "../ui/AppImage";
import StarRating from "../ui/StarRating";
import ChargeNotice from "./ChargeNotice";

type PackageBookingSummaryProps = {
  offer: PackageOffer;
  search: PackageSearch;
};

const PackageBookingSummary = ({ offer, search }: PackageBookingSummaryProps) => {
  const { hotel, room, flight, currency } = offer;
  const legs = flight.inbound ? [flight.outbound, flight.inbound] : [flight.outbound];
  const nights = nightsBetween(search.departDate ?? "", search.returnDate ?? "");
  const travelers = search.adults + search.children;

  return (
    <aside aria-label="Booking summary" className="overflow-hidden rounded-card border border-line lg:sticky lg:top-24">
      <div className="relative aspect-[16/9] bg-surface-alt">
        <AppImage src={hotel.imageUrl} alt={hotel.name} fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
      </div>

      <div className="p-4">
        <StarRating stars={hotel.stars} />
        <h2 className="font-semibold">{hotel.name}</h2>
        <p className="text-sm text-muted">
          {hotel.area}, {hotel.city}
        </p>
        <p className="mt-2 text-sm">
          {formatCount(search.rooms, "room")} · {room.name}
        </p>
        <p className="text-sm text-muted">
          {formatShortDate(search.departDate ?? "")} - {formatShortDate(search.returnDate ?? "")} · {formatCount(nights, "night")}
        </p>

        <ul className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
          {legs.map((leg) => (
            <li key={`${leg.from}-${leg.date}`}>
              <p className="mb-1 text-xs font-medium text-ink-soft">
                {flight.airline} · {formatShortDate(leg.date)}
              </p>
              <FlightLegRow leg={leg} showDate={false} />
            </li>
          ))}
        </ul>

        <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Flights, {formatCount(travelers, "traveler")}</dt>
            <dd>{formatPrice(offer.flightTotal, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Hotel, {formatCount(nights, "night")}</dt>
            <dd>{formatPrice(offer.hotelTotal, currency)}</dd>
          </div>
          <div className="flex justify-between text-success">
            <dt>Package discount</dt>
            <dd>-{formatPrice(offer.discount, currency)}</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-bold text-primary">{formatPrice(offer.totalPrice, currency)}</dd>
          </div>
        </dl>
        <ChargeNotice />
      </div>
    </aside>
  );
};

export default PackageBookingSummary;
