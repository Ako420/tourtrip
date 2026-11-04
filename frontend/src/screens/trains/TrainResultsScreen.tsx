import { Suspense } from "react";
import { FlightResultsSkeleton, StatusMessage, TrainResultsView, TrainSearchForm } from "@/components";
import { parseTrainFilters, parseTrainSearch, toTrainQuery } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import { getTrainStations, searchTrains } from "@/services";
import type { RouteParams } from "@/types";

type TrainResultsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const TrainResults = async ({ searchParams }: TrainResultsScreenProps) => {
  const params = await searchParams;
  const search = parseTrainSearch(params);
  const filters = parseTrainFilters(params);
  const stations = await getTrainStations();
  const isValid = flightSearchSchema.safeParse({
    ...search,
    from: search.from ?? "",
    to: search.to ?? "",
    departDate: search.departDate ?? "",
  }).success;

  return (
    <>
      <TrainSearchForm key={toTrainQuery(search)} initialValues={search} stations={stations} />
      {isValid ? (
        <TrainResultsView search={search} filters={filters} result={await searchTrains(search, filters)} />
      ) : (
        <StatusMessage iconName="train" title="Finish your search" description="Add your route and dates above to see trains." />
      )}
    </>
  );
};

const TrainResultsScreen = ({ searchParams }: TrainResultsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <TrainResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TrainResultsScreen;
