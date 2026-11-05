import { Suspense } from "react";
import {
  BenefitColumns,
  Breadcrumb,
  FlightsSkeleton,
  SectionNav,
  StickyBar,
  TrainGuides,
  TrainHero,
  TrainJourneys,
  TrainOperators,
  TrainRegion,
  TrainRouteSection,
  TrainSteps,
} from "@/components";
import { parseTrainSearch, toTrainQuery } from "@/lib";
import { getGuidesByCity, getTrainsContent, getTrainStations } from "@/services";
import type { RouteParams } from "@/types";

type TrainsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const TrainsContent = async ({ searchParams }: TrainsScreenProps) => {
  const search = parseTrainSearch(await searchParams);
  const [content, stations] = await Promise.all([getTrainsContent(), getTrainStations()]);
  const guides = await getGuidesByCity(content.guides.tabs.flatMap((tab) => tab.cities));

  return (
    <>
      <TrainHero key={toTrainQuery(search)} hero={content.hero} search={search} stations={stations} />

      <StickyBar dense>
        <SectionNav label="Page sections" links={content.sectionLinks} />
      </StickyBar>

      <div className="page-sheet bg-surface! px-4 pt-8 pb-16">
        <div className="mx-auto max-w-content">
          <Breadcrumb links={[{ label: "Hotel Jr", href: "/" }]} current="Trains" />
        </div>

        <BenefitColumns items={content.benefits} />
        <TrainOperators section={content.operators} />
        {content.regions.map((region) => (
          <TrainRegion key={region.id} region={region} />
        ))}
        {content.routeSections.map((section) => (
          <TrainRouteSection key={section.id} section={section} />
        ))}
        <TrainSteps section={content.steps} />
        <TrainGuides section={content.guides} guides={guides} />
        <TrainJourneys section={content.journeys} />
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
