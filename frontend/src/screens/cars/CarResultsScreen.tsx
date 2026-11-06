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
      <div className="mx-auto max-w-content">
        <CarSearchForm key={toCarQuery(search)} initialValues={search} locations={locations} compact highlighted />
      </div>

      <div className="-mx-4 -mb-4 mt-4 bg-surface-alt px-4 py-6 lg:-mx-8 lg:-mb-8 lg:px-8">
        <div className="mx-auto max-w-content">
          {isValid ? (
            <CarResultsView search={search} filters={filters} result={await searchCars(search, filters)} />
          ) : (
            <StatusMessage iconName="car" title="Finish your search" description="Add your location and dates above to see cars." />
          )}
        </div>
      </div>
    </>
  );
};

const CarResultsScreen = ({ searchParams }: CarResultsScreenProps) => {
  return (
    <Suspense fallback={<FlightResultsSkeleton />}>
      <CarResults searchParams={searchParams} />
    </Suspense>
  );
};

export default CarResultsScreen;
