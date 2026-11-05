import { Suspense } from "react";
import { FlightsSkeleton, LinkCards, MobileAppHero, TrustSection } from "@/components";
import { getMobileAppContent } from "@/services";

const MobileAppContent = async () => {
  const { hero, planned, today } = await getMobileAppContent();

  return (
    <>
      <MobileAppHero hero={hero} />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10 pb-8">
        <TrustSection section={planned} />
        <LinkCards title={today.title} items={today.items} />
      </div>
    </>
  );
};

const MobileAppScreen = () => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <MobileAppContent />
    </Suspense>
  );
};

export default MobileAppScreen;
