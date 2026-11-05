import type { RewardEarnRate } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

type RewardsEarnRatesProps = {
  rates: RewardEarnRate[];
};

const RewardsEarnRates = ({ rates }: RewardsEarnRatesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>Coins you earn</SectionHeading>
      <p className="-mt-3 mb-5 text-sm text-muted">Coins for every US$100 you pay. 100 Jr Coins are worth about US$1.</p>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {rates.map((rate) => (
          <li key={rate.id} className="flex h-full flex-col rounded-card border border-line p-4">
            <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon name={rate.iconName} />
            </span>
            <span className="text-sm text-ink-soft">{rate.label}</span>
            <span className="mt-auto pt-1 text-xl font-bold">{rate.coinsPer100} coins</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RewardsEarnRates;
