import { Suspense } from "react";
import { FlightsSkeleton, Recommendations, TourDestinations, TourHero, TourPlaces, TourResults } from "@/components";
import { parseTourQuery } from "@/lib";
import { getToursContent, searchTours } from "@/services";
import type { RouteParams, TourType } from "@/types";

type ToursScreenProps = {
  type: TourType;
  searchParams: Promise<RouteParams>;
};

const ToursContent = async ({ type, searchParams }: ToursScreenProps) => {
  const query = parseTourQuery(await searchParams);
  const [content, tours] = await Promise.all([getToursContent(type), searchTours(type, query)]);

  return (
    <>
      <TourHero type={type} content={content} query={query} />

      <div className="page-sheet bg-surface! pt-6">
        <div className="px-4">
          {query ? (
            <TourResults type={type} tours={tours} query={query} />
          ) : (
            <TourDestinations section={content.recommended} tours={tours} />
          )}
        </div>

        <div className="mt-14 bg-primary-soft/40 px-4 py-14">
          <TourPlaces section={content.cities} />
          <TourPlaces section={content.countries} />
        </div>

        <div className="px-4">
          <Recommendations section={content.recommendations} />
        </div>
      </div>
    </>
  );
};

const ToursScreen = ({ type, searchParams }: ToursScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <ToursContent type={type} searchParams={searchParams} />
    </Suspense>
  );
};

export default ToursScreen;
