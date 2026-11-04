import { Suspense } from "react";
import { HotelListSkeleton, HotelResultsView, SearchForm } from "@/components";
import { parseHotelFilters, parseHotelSearch, toSearchQuery } from "@/lib";
import { getDestinations, searchHotels } from "@/services";
import type { RouteParams } from "@/types";

type HotelsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const HotelResults = async ({ searchParams }: HotelsScreenProps) => {
  const params = await searchParams;
  const search = parseHotelSearch(params);
  const filters = parseHotelFilters(params);
  const [result, destinations] = await Promise.all([searchHotels(search, filters), getDestinations()]);

  return (
    <>
      <SearchForm key={toSearchQuery(search)} initialValues={search} destinations={destinations} />
      <HotelResultsView search={search} filters={filters} result={result} />
    </>
  );
};

const HotelsScreen = ({ searchParams }: HotelsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelListSkeleton />}>
        <HotelResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HotelsScreen;
