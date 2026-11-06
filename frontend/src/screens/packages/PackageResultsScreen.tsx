import { Suspense } from "react";
import {
  FlightResultsSkeleton,
  Icon,
  PackageFlightChoices,
  PackageOfferCard,
  PackageSearchForm,
  StatusMessage,
} from "@/components";
import {
  formatCount,
  formatShortDate,
  nightsBetween,
  parsePackageSearch,
  parsePackageSelection,
  toPackageBookHref,
  toPackageQuery,
} from "@/lib";
import { packageSearchSchema } from "@/schemas";
import { getAirports, getDestinations, searchPackages } from "@/services";
import type { RouteParams } from "@/types";

type PackageResultsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackageResultsContent = async ({ searchParams }: PackageResultsScreenProps) => {
  const params = await searchParams;
  const search = parsePackageSearch(params);
  const [airports, destinations] = await Promise.all([getAirports(), getDestinations()]);
  const form = (
    <PackageSearchForm key={toPackageQuery(search)} initialValues={search} airports={airports} destinations={destinations} />
  );

  if (!packageSearchSchema.safeParse(search).success) {
    return (
      <>
        {form}
        <StatusMessage iconName="building" title="Choose your trip" description="Add your cities and dates above to see packages." />
      </>
    );
  }

  const { flightChoices, selectedFlightId, offers } = await searchPackages(search, parsePackageSelection(params).flightId);
  const travelers = search.adults + search.children;
  const nights = nightsBetween(search.departDate ?? "", search.returnDate ?? "");

  return (
    <>
      {form}

      <header className="mt-6 mb-4">
        <h1 className="text-lg font-bold">
          {search.from} to {search.to}
        </h1>
        <p className="text-sm text-ink-soft">
          {formatShortDate(search.departDate ?? "")} - {formatShortDate(search.returnDate ?? "")} ·{" "}
          {formatCount(nights, "night")} · {formatCount(travelers, "traveler")} · {formatCount(search.rooms, "room")}
        </p>
      </header>

      {offers.length > 0 ? (
        <>
          <PackageFlightChoices choices={flightChoices} selectedId={selectedFlightId} search={search} />

          <section className="mt-4">
            <div className="rounded-card bg-surface p-4 sm:p-6">
              <h2 className="flex items-center gap-3 font-bold">
                <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-sm text-white">
                  <Icon name="bed" />
                </span>
                Hotel ({formatCount(nights, "night")})
              </h2>
            </div>

            <ul className="mt-3 flex flex-col gap-3">
              {offers.map((offer) => (
                <li key={offer.hotel.id}>
                  <PackageOfferCard offer={offer} bookHref={toPackageBookHref(search, offer)} travelers={travelers} />
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <StatusMessage
          iconName="building"
          title="No packages found"
          description={`We have no stays in ${search.to} that fit your group yet. Try another city, or add a room.`}
        />
      )}
    </>
  );
};

const PackageResultsScreen = ({ searchParams }: PackageResultsScreenProps) => {
  return (
    <>
      <div className="h-48 bg-primary xl:h-37" />

      <div className="page-sheet px-4 pt-px pb-8">
        <div className="relative mx-auto -mt-12 max-w-content">
          <Suspense fallback={<FlightResultsSkeleton />}>
            <PackageResultsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default PackageResultsScreen;
