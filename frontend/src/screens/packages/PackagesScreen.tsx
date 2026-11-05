import { Suspense } from "react";
import { FlightsSkeleton, HotelBenefits, PackageDeals, PackageHero } from "@/components";
import { parsePackageSearch } from "@/lib";
import { getAirports, getDestinations, getPackageDeals, getPackagesContent } from "@/services";
import type { RouteParams } from "@/types";

type PackagesScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackagesContent = async ({ searchParams }: PackagesScreenProps) => {
  const search = parsePackageSearch(await searchParams);
  const [content, airports, destinations] = await Promise.all([getPackagesContent(), getAirports(), getDestinations()]);
  const deals = await getPackageDeals(content.deals.routes);

  return (
    <>
      <PackageHero
        key={search.to}
        hero={content.hero}
        search={search}
        airports={airports}
        destinations={destinations}
      />

      <div className="page-sheet bg-surface! px-4 pt-1 pb-20">
        <HotelBenefits items={content.benefits} />
        <PackageDeals section={content.deals} deals={deals} />
      </div>
    </>
  );
};

const PackagesScreen = ({ searchParams }: PackagesScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <PackagesContent searchParams={searchParams} />
    </Suspense>
  );
};

export default PackagesScreen;
