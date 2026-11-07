import type { CSSProperties } from "react";
import type { AccountUser, RewardsProgram } from "@/types";
import Icon from "../ui/Icon";
import RewardsHeading from "./RewardsHeading";
import RewardsJoinButton from "./RewardsJoinButton";

type RewardsProgressProps = {
  user: AccountUser | null;
  program: RewardsProgram;
};

const RewardsProgress = ({ user, program }: RewardsProgressProps) => {
  const { progress, tiers, joinLabel } = program;

  return (
    <section className="mt-16 bg-surface-alt px-4 py-16 sm:mt-24 sm:py-24">
      <div className="mx-auto max-w-content">
        <RewardsHeading copy={progress} />

        <ol className="grid grid-cols-2 items-end gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tiers.map((tier, index) => (
            <li
              key={tier.id}
              style={{ "--step": index } as CSSProperties}
              className="text-center lg:pb-[calc(var(--step)*2.5rem)]"
            >
              <p className="mx-auto mb-3 w-fit max-w-40 rounded-card bg-surface p-3 text-sm font-semibold shadow-card">
                {tier.howToReach}
              </p>
              <Icon name="gem" className="text-3xl text-primary" />
              <p className="mt-2 font-medium">{tier.name}</p>
            </li>
          ))}
        </ol>

        <RewardsJoinButton user={user} label={joinLabel} />
      </div>
    </section>
  );
};

export default RewardsProgress;
