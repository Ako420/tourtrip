import { Suspense } from "react";
import { FlightsSkeleton, TourHero, TourResults } from "@/components";
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

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10 pb-8">
        <TourResults type={type} tours={tours} query={query} />
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
