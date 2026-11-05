import type { AccountUser, RewardsProgram } from "@/types";
import Icon from "../ui/Icon";
import RewardsHeading from "./RewardsHeading";
import RewardsJoinButton from "./RewardsJoinButton";

type RewardsEarnProps = {
  user: AccountUser | null;
  program: RewardsProgram;
};

const subheadingClass = "mb-8 text-center text-xl font-medium sm:text-2xl";

const RewardsEarn = ({ user, program }: RewardsEarnProps) => {
  const { earn, earnRates, tiers, joinLabel } = program;

  return (
    <section className="mt-16 bg-surface-alt px-4 py-16 sm:mt-24 sm:py-24">
      <div className="mx-auto max-w-content">
        <RewardsHeading copy={earn} />

        <h3 className={subheadingClass}>{earn.productsTitle}</h3>
        <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-6">
          {earnRates.map((rate) => (
            <li key={rate.id} className="w-28 text-center">
              <span className="mx-auto flex size-24 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-3xl text-primary">
                <Icon name={rate.iconName} />
              </span>
              <p className="mt-2">{rate.label}</p>
              <p className="text-xs text-muted">{rate.coinsPer100} coins per US$100</p>
            </li>
          ))}
        </ul>

        <h3 className={`${subheadingClass} mt-14`}>{earn.tiersTitle}</h3>
        <ul className="mx-auto grid max-w-250 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {tiers.map((tier) => (
            <li key={tier.id} className="rounded-card bg-surface p-4 text-center shadow-card">
              <Icon name="coins" className="text-2xl text-primary" />
              {tier.coinBoost > 0 && <span className="ml-1 text-sm font-bold">+{tier.coinBoost}%</span>}
              <p className="mt-2">{tier.name}</p>
            </li>
          ))}
        </ul>

        <RewardsJoinButton user={user} label={joinLabel} />
      </div>
    </section>
  );
};

export default RewardsEarn;
