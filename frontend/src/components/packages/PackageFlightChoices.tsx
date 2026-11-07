import Link from "next/link";
import { formatShortDate, toPackageQuery } from "@/lib";
import type { PackageFlightChoice, PackageSearch } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type PackageFlightChoicesProps = {
  choices: PackageFlightChoice[];
  selectedId?: string;
  search: PackageSearch;
};

const PackageFlightChoices = ({ choices, selectedId, search }: PackageFlightChoicesProps) => {
  const selected = choices.find(({ flight }) => flight.id === selectedId)?.flight;
  const legs = selected ? [selected.outbound, ...(selected.inbound ? [selected.inbound] : [])] : [];

  return (
    <section className="rounded-card bg-surface p-4 sm:p-6">
      <h2 className="flex items-center gap-3 font-bold">
        <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-sm text-white">
          <Icon name="plane" />
        </span>
        Flight
      </h2>

      {selected && (
        <div className="mt-4 flex flex-col gap-4">
          {legs.map((leg) => (
            <div key={`${leg.from}-${leg.date}`}>
              <p className="mb-2 text-sm text-ink-soft">
                {formatShortDate(leg.date)} | {selected.cabin} | {selected.airline}
              </p>
              <FlightLegRow leg={leg} showDate={false} large />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <h3 className="mb-2 text-sm font-bold">Change flight</h3>
        <ul className="grid gap-3 sm:grid-cols-3">
          {choices.map(({ label, flight }) => {
            const isSelected = flight.id === selectedId;
            const query = new URLSearchParams(toPackageQuery(search));

            query.set("flight", flight.id);

            return (
              <li key={flight.id}>
                <Link
                  href={`/packages/results?${query}`}
                  scroll={false}
                  aria-current={isSelected ? "true" : undefined}
                  className={`block h-full rounded-card border p-3 transition-colors duration-300 ease-out ${
                    isSelected ? "border-primary bg-primary-soft" : "border-line hover:border-primary"
                  }`}
                >
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="block text-sm text-ink-soft">{flight.airline}</span>
                  <span className="mt-1 block font-bold"><Price amount={flight.totalPrice} currency={flight.currency} /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default PackageFlightChoices;
