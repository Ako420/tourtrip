import { Suspense } from "react";
import {
  RewardsEarn,
  RewardsFaqs,
  RewardsHero,
  RewardsJoinButton,
  RewardsMembership,
  RewardsPerkTable,
  RewardsProgress,
  RewardsSpend,
  Skeleton,
} from "@/components";
import { getCurrentUser, getRewardsProgram } from "@/services";

const RewardsContent = async () => {
  const [user, program] = await Promise.all([getCurrentUser(), getRewardsProgram()]);

  return (
    <>
      <RewardsHero hero={program.hero} />

      <div className="page-sheet bg-surface! pt-px">
        <div className="px-4">
          <RewardsMembership user={user} membership={program.membership} joinLabel={program.joinLabel} />
          <RewardsPerkTable user={user} program={program} />
        </div>

        <RewardsEarn user={user} program={program} />

        <div className="px-4">
          <RewardsSpend user={user} spend={program.spend} joinLabel={program.joinLabel} />
        </div>

        <RewardsProgress user={user} program={program} />

        <div className="px-4">
          <RewardsFaqs faqs={program.faqs} />
        </div>

        <section className="mt-16 bg-surface-alt px-4 py-16 text-center sm:mt-24 sm:py-24">
          <h2 className="type-section-lg font-bold">{program.closingTitle}</h2>
          <RewardsJoinButton user={user} label={program.joinLabel} />
        </section>
      </div>
    </>
  );
};

const RewardsScreen = () => {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <RewardsContent />
    </Suspense>
  );
};

export default RewardsScreen;
