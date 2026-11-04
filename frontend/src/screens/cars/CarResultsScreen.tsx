import { Suspense } from "react";
import { CarResultsView, CarSearchForm, FlightResultsSkeleton, StatusMessage } from "@/components";
import { parseCarFilters, parseCarSearch, toCarQuery } from "@/lib";
import { carSearchSchema } from "@/schemas";
import { getCarLocations, searchCars } from "@/services";
import type { RouteParams } from "@/types";

type CarResultsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const CarResults = async ({ searchParams }: CarResultsScreenProps) => {
  const params = await searchParams;
  const search = parseCarSearch(params);
  const filters = parseCarFilters(params);
  const locations = await getCarLocations();
  const isValid = carSearchSchema.safeParse({
    ...search,
    location: search.location ?? "",
    pickupDate: search.pickupDate ?? "",
    dropoffDate: search.dropoffDate ?? "",
    hasDifferentDropoff: Boolean(search.dropoffLocation),
  }).success;

  return (
    <>
      <CarSearchForm key={toCarQuery(search)} initialValues={search} locations={locations} />
      {isValid ? (
        <CarResultsView search={search} filters={filters} result={await searchCars(search, filters)} />
      ) : (
        <StatusMessage iconName="car" title="Finish your search" description="Add your location and dates above to see cars." />
      )}
    </>
  );
};

const CarResultsScreen = ({ searchParams }: CarResultsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <CarResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default CarResultsScreen;
