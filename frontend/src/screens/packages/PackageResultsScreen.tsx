import { Suspense } from "react";
import {
  ButtonLink,
  FlightResultsSkeleton,
  PackageFlightChoices,
  PackageOfferCard,
  SectionHeading,
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
import { searchPackages } from "@/services";
import type { RouteParams } from "@/types";

type PackageResultsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackageResultsContent = async ({ searchParams }: PackageResultsScreenProps) => {
  const params = await searchParams;
  const search = parsePackageSearch(params);
  const editHref = `/packages?${toPackageQuery(search)}`;

  if (!packageSearchSchema.safeParse(search).success) {
    return (
      <StatusMessage iconName="building" title="Choose your trip" description="Add your cities and dates to see packages.">
        <ButtonLink href="/packages">Search Flight + Hotel</ButtonLink>
      </StatusMessage>
    );
  }

  const { flightChoices, selectedFlightId, offers } = await searchPackages(search, parsePackageSelection(params).flightId);
  const travelers = search.adults + search.children;
  const nights = nightsBetween(search.departDate ?? "", search.returnDate ?? "");

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {search.from} to {search.to}
          </h1>
          <p className="text-sm text-muted">
            {formatShortDate(search.departDate ?? "")} - {formatShortDate(search.returnDate ?? "")} ·{" "}
            {formatCount(nights, "night")} · {formatCount(travelers, "traveler")} · {formatCount(search.rooms, "room")}
          </p>
        </div>
        <ButtonLink href={editHref} variant="outline" size="sm">
          Change search
        </ButtonLink>
      </header>

      {offers.length > 0 ? (
        <>
          <PackageFlightChoices choices={flightChoices} selectedId={selectedFlightId} search={search} />

          <section className="mt-8">
            <SectionHeading>Choose your stay</SectionHeading>
            <ul className="flex flex-col gap-4">
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
        >
          <ButtonLink href={editHref}>Change search</ButtonLink>
        </StatusMessage>
      )}
    </>
  );
};

const PackageResultsScreen = ({ searchParams }: PackageResultsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <PackageResultsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PackageResultsScreen;
