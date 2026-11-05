import { Suspense } from "react";
import { CruiseHero, CruiseResults, FlightsSkeleton } from "@/components";
import { parseCruiseFilters } from "@/lib";
import { getCruisesContent, searchCruises } from "@/services";
import type { RouteParams } from "@/types";

type CruisesScreenProps = {
  searchParams: Promise<RouteParams>;
};

const CruisesContent = async ({ searchParams }: CruisesScreenProps) => {
  const filters = parseCruiseFilters(await searchParams);
  const [content, result] = await Promise.all([getCruisesContent(), searchCruises(filters)]);

  return (
    <>
      <CruiseHero content={content} filters={filters} />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10 pb-8">
        <CruiseResults result={result} filters={filters} />
      </div>
    </>
  );
};

const CruisesScreen = ({ searchParams }: CruisesScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <CruisesContent searchParams={searchParams} />
    </Suspense>
  );
};

export default CruisesScreen;
