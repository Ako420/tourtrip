import type { RewardTier } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

type RewardsTiersProps = {
  tiers: RewardTier[];
};

const RewardsTiers = ({ tiers }: RewardsTiersProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>The more you book, the higher you go</SectionHeading>
      <p className="-mt-3 mb-5 text-sm text-muted">Planned perks depend on travel partners and are not available yet.</p>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <li key={tier.id} className="rounded-card border border-line p-5">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Icon name="gem" className="text-primary" />
              {tier.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-accent">
              {tier.coinBoost > 0 ? `Earn ${tier.coinBoost}% more coins` : "Earn Jr Coins"}
            </p>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-muted">How to reach it</dt>
                <dd className="font-medium">{tier.howToReach}</dd>
              </div>
              <div>
                <dt className="text-muted">How to keep it</dt>
                <dd className="font-medium">{tier.howToKeep}</dd>
              </div>
            </dl>
            {tier.plannedPerks.length > 0 && (
              <div className="mt-3 border-t border-line pt-3 text-sm">
                <h4 className="text-muted">Planned perks</h4>
                <ul className="mt-1 flex flex-col gap-1 font-medium">
                  {tier.plannedPerks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default RewardsTiers;
