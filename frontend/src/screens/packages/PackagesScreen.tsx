import { Suspense } from "react";
import { FlightsSkeleton, FlightTips, Inspiration, PackageHero, TrustSection } from "@/components";
import { parsePackageSearch } from "@/lib";
import { getAirports, getDestinations, getPackagesContent } from "@/services";
import type { RouteParams } from "@/types";

type PackagesScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackagesContent = async ({ searchParams }: PackagesScreenProps) => {
  const search = parsePackageSearch(await searchParams);
  const [content, airports, destinations] = await Promise.all([getPackagesContent(), getAirports(), getDestinations()]);

  return (
    <>
      <PackageHero
        key={search.to}
        hero={content.hero}
        search={search}
        airports={airports}
        destinations={destinations}
      />

      <div className="page-sheet px-4 pt-10 pb-8">
        <TrustSection section={content.trust} />
        <Inspiration section={content.destinations} />
        <FlightTips section={content.faqs} />
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
