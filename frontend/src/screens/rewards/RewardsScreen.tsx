import { Suspense } from "react";
import {
  FlightTips,
  RewardsEarnRates,
  RewardsHero,
  RewardsMembership,
  RewardsTiers,
  Skeleton,
} from "@/components";
import { getCurrentUser, getRewardsProgram } from "@/services";

const MembershipContent = async () => {
  return <RewardsMembership user={await getCurrentUser()} />;
};

const ProgramContent = async () => {
  const { tiers, earnRates, faqs } = await getRewardsProgram();

  return (
    <>
      <RewardsTiers tiers={tiers} />
      <RewardsEarnRates rates={earnRates} />
      <FlightTips section={{ title: "How rewards work", items: faqs }} />
    </>
  );
};

const RewardsScreen = () => {
  return (
    <div className="pb-8">
      <RewardsHero />

      <Suspense fallback={<Skeleton className="mx-auto mt-6 h-24 max-w-content" />}>
        <MembershipContent />
      </Suspense>

      <Suspense fallback={<Skeleton className="mx-auto mt-12 h-96 max-w-content" />}>
        <ProgramContent />
      </Suspense>
    </div>
  );
};

export default RewardsScreen;
