import { Suspense } from "react";
import { DealCampaigns, DealCoupons, DealFlights, HotelGrid, Skeleton } from "@/components";
import { getDeals } from "@/services";

const DealsContent = async () => {
  const { campaigns, hotelDeals, flightDeals, promotions } = await getDeals();

  return (
    <>
      <DealCampaigns campaigns={campaigns} />
      <HotelGrid title="Hot hotel deals" hotels={hotelDeals} />
      <DealFlights title="Hot flight deals" deals={flightDeals} />
      <DealCoupons promotions={promotions} />
    </>
  );
};

const DealsScreen = () => {
  return (
    <div className="pb-8">
      <header className="mx-auto mb-6 max-w-content">
        <h1 className="text-3xl font-bold sm:text-4xl">Today&apos;s top deals</h1>
        <p className="mt-1 text-muted">Current offers on hotels, flights and things to do.</p>
      </header>

      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-content" />}>
        <DealsContent />
      </Suspense>
    </div>
  );
};

export default DealsScreen;
