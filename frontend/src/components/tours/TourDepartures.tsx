import { formatCount, formatPrice, formatShortDate } from "@/lib";
import type { TourDetails } from "@/types";

type TourDeparturesProps = {
  tour: TourDetails;
};

const TourDepartures = ({ tour }: TourDeparturesProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Departures</h2>

      {tour.type === "private" ? (
        <p className="rounded-card bg-primary-soft p-4 text-sm">
          This tour runs just for your group, so you choose the start date.
        </p>
      ) : tour.departures.length > 0 ? (
        <ul className="divide-y divide-line rounded-card border border-line px-4">
          {tour.departures.map((departure) => (
            <li key={departure.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
              <span className="font-medium">{formatShortDate(departure.date)}</span>
              <span className="text-muted">{formatCount(departure.seatsLeft, "seat")} left</span>
              <span className="font-bold">{formatPrice(departure.price, tour.currency)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-line p-4 text-sm text-muted">There are no upcoming departures right now.</p>
      )}
    </section>
  );
};

export default TourDepartures;
