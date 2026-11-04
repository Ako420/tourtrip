import { Suspense } from "react";
import { FlightResultsSkeleton, FlightResultsView, FlightSearchForm, StatusMessage } from "@/components";
import { parseFlightFilters, parseFlightSearch, toFlightQuery } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import { getAirports, searchFlights } from "@/services";
import type { RouteParams } from "@/types";

type FlightResultsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const FlightResults = async ({ searchParams }: FlightResultsScreenProps) => {
  const params = await searchParams;
  const search = parseFlightSearch(params);
  const airports = await getAirports();
  const isValid = flightSearchSchema.safeParse({
    from: search.from ?? "",
    to: search.to ?? "",
    tripType: search.tripType,
    departDate: search.departDate ?? "",
    returnDate: search.returnDate,
  }).success;

  const filters = parseFlightFilters(params);

  return (
    <>
      <FlightSearchForm key={toFlightQuery(search)} initialValues={search} airports={airports} />
      {isValid ? (
        <FlightResultsView search={search} filters={filters} result={await searchFlights(search, filters)} />
      ) : (
        <StatusMessage iconName="plane" title="Finish your search" description="Add your route and dates above to see flights." />
      )}
    </>
  );
};

const FlightResultsScreen = ({ searchParams }: FlightResultsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <FlightResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default FlightResultsScreen;
