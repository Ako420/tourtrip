import Link from "next/link";
import { formatShortDate } from "@/lib";
import type { FlightLeg } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import Icon from "../ui/Icon";

type BookingTripCardProps = {
  destination?: string;
  carrier: string;
  detail: string;
  legs: FlightLeg[];
  vehicle?: "plane" | "train";
  change?: { href: string; label: string };
};

const BookingTripCard = ({ destination, carrier, detail, legs, vehicle = "plane", change }: BookingTripCardProps) => {
  return (
    <section className="rounded-card bg-surface p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold">Trip to {destination}</h2>
        {change && (
          <Link href={change.href} className="text-sm text-primary hover:underline">
            {change.label}
          </Link>
        )}
      </div>

      <div className="mt-3 rounded-card border border-line p-4">
        <p className="flex items-center gap-2 text-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name={vehicle} className="text-tiny" />
          </span>
          <span className="font-semibold">{carrier}</span>
          <span className="text-ink-soft">{detail}</span>
        </p>

        <ul className="mt-3 flex flex-col gap-3">
          {legs.map((leg) => (
            <li key={`${leg.from}-${leg.date}`}>
              <p className="mb-1 text-sm font-medium">{formatShortDate(leg.date)}</p>
              <FlightLegRow leg={leg} showDate={false} vehicle={vehicle} large />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BookingTripCard;
