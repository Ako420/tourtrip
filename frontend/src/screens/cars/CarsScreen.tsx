import { Suspense } from "react";
import { CarCities, CarHero, CarTypes, FlightsSkeleton, FlightTips, TrustSection } from "@/components";
import { parseCarFilters, parseCarSearch } from "@/lib";
import { getCarLocations, getCarsContent } from "@/services";
import type { CarCategory, RouteParams } from "@/types";

type CarsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const CarsContent = async ({ searchParams }: CarsScreenProps) => {
  const params = await searchParams;
  const search = parseCarSearch(params);
  const [content, locations] = await Promise.all([getCarsContent(), getCarLocations()]);
  const preselectedType = parseCarFilters(params).categories[0] as CarCategory | undefined;

  return (
    <>
      <CarHero
        key={`${search.location}-${preselectedType}`}
        hero={content.hero}
        search={search}
        locations={locations}
        preselectedType={preselectedType}
      />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10 pb-8">
        <TrustSection section={content.trust} />
        <CarTypes section={content.types} />
        <CarCities section={content.cities} />
        <FlightTips section={content.faqs} />
      </div>
    </>
  );
};

const CarsScreen = ({ searchParams }: CarsScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <CarsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default CarsScreen;
