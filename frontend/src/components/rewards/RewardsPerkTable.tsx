import { formatCount } from "@/lib";
import type { AccountUser, RewardsProgram } from "@/types";
import Icon from "../ui/Icon";
import RewardsHeading from "./RewardsHeading";
import RewardsJoinButton from "./RewardsJoinButton";

type RewardsPerkTableProps = {
  user: AccountUser | null;
  program: RewardsProgram;
};

const rowClass = "grid grid-cols-[12.5rem_repeat(6,minmax(0,1fr))] gap-x-3";

const RewardsPerkTable = ({ user, program }: RewardsPerkTableProps) => {
  const { why, tiers, perks, joinLabel } = program;
  const getRewardCount = (tierIndex: number) => perks.filter((perk) => perk.values[tierIndex]).length;

  return (
    <section className="mx-auto mt-16 max-w-content sm:mt-24">
      <RewardsHeading copy={why} />

      <div className="scrollbar-none overflow-x-auto lg:overflow-visible">
        <div className="min-w-[56rem]">
          <div className={`${rowClass} bg-surface py-2 lg:sticky lg:top-0 lg:z-10`}>
            <span />
            {tiers.map((tier, index) => (
              <div key={tier.id} className="relative rounded-card bg-primary-soft/50 p-3">
                <Icon name="gem" className="absolute top-2 right-2 text-lg text-primary" />
                <p className="font-bold">{tier.name}</p>
                <p className="mt-2 text-ink-soft">{formatCount(getRewardCount(index), "reward")}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-4 text-xl font-bold">Perks</h3>
          {perks.map((perk) => (
            <div key={perk.id} className={`${rowClass} items-center border-b border-line py-6 last:border-b-0`}>
              <span className="flex items-center gap-3 font-medium">
                <Icon name={perk.iconName} className="text-lg text-primary" />
                {perk.label}
              </span>
              {perk.values.map((value, index) => (
                <span key={tiers[index].id} className="text-center text-ink-soft">
                  {value || "-"}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <RewardsJoinButton user={user} label={joinLabel} />
    </section>
  );
};

export default RewardsPerkTable;
