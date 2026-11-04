import { Suspense } from "react";
import { FlightsSkeleton, FlightTips, TrainHero, TrainRoutes, TrustSection } from "@/components";
import { parseTrainSearch, toTrainQuery } from "@/lib";
import { getTrainsContent, getTrainStations } from "@/services";
import type { RouteParams } from "@/types";

type TrainsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const TrainsContent = async ({ searchParams }: TrainsScreenProps) => {
  const search = parseTrainSearch(await searchParams);
  const [content, stations] = await Promise.all([getTrainsContent(), getTrainStations()]);

  return (
    <>
      <TrainHero key={toTrainQuery(search)} hero={content.hero} search={search} stations={stations} />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10 pb-8">
        <TrustSection section={content.trust} />
        <TrainRoutes section={content.routes} />
        <FlightTips section={content.faqs} />
      </div>
    </>
  );
};

const TrainsScreen = ({ searchParams }: TrainsScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <TrainsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default TrainsScreen;
