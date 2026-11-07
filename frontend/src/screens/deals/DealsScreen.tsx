import { Suspense } from "react";
import { DealCampaigns, DealsAbout, Skeleton } from "@/components";
import { getDeals } from "@/services";

const DealsContent = async () => {
  const { campaigns, about, popularFlights } = await getDeals();

  return (
    <>
      <DealCampaigns campaigns={campaigns} />
      <DealsAbout about={about} popularFlights={popularFlights} />
    </>
  );
};

const DealsScreen = () => {
  return (
    <div className="pt-6 pb-8">
      <h1 className="mb-8 text-center type-hero font-bold">Today&apos;s top deals</h1>

      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-content" />}>
        <DealsContent />
      </Suspense>
    </div>
  );
};

export default DealsScreen;
