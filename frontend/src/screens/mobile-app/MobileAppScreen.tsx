import { Suspense } from "react";
import { FlightsSkeleton, MobileAppHero, MobileAppPlanned } from "@/components";
import { getMobileAppContent } from "@/services";

const MobileAppContent = async () => {
  const { hero, planned, today } = await getMobileAppContent();

  return (
    <div className="overflow-hidden bg-primary">
      <MobileAppHero hero={hero} today={today} />
      <MobileAppPlanned section={planned} />
    </div>
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
