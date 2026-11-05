import Link from "next/link";
import { formatPrice, toPackageQuery } from "@/lib";
import type { PackageFlightChoice, PackageSearch } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import SectionHeading from "../ui/SectionHeading";

type PackageFlightChoicesProps = {
  choices: PackageFlightChoice[];
  selectedId?: string;
  search: PackageSearch;
};

const PackageFlightChoices = ({ choices, selectedId, search }: PackageFlightChoicesProps) => {
  const selected = choices.find(({ flight }) => flight.id === selectedId)?.flight;
  const legs = selected ? [selected.outbound, ...(selected.inbound ? [selected.inbound] : [])] : [];

  return (
    <section>
      <SectionHeading>Your flight</SectionHeading>

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
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-sm text-ink-soft">{flight.airline}</span>
                <span className="mt-1 block font-bold">{formatPrice(flight.totalPrice, flight.currency)}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="mt-3 flex flex-col gap-3 rounded-card border border-line p-4">
          {legs.map((leg) => (
            <FlightLegRow key={`${leg.from}-${leg.date}`} leg={leg} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PackageFlightChoices;
