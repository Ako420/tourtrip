import type { AccountUser, RewardsProgram } from "@/types";
import Icon from "../ui/Icon";
import RewardsHeading from "./RewardsHeading";
import RewardsJoinButton from "./RewardsJoinButton";

type RewardsSpendProps = {
  user: AccountUser | null;
  spend: RewardsProgram["spend"];
  joinLabel: string;
};

const RewardsSpend = ({ user, spend, joinLabel }: RewardsSpendProps) => {
  return (
    <section className="mx-auto mt-16 max-w-content sm:mt-24">
      <RewardsHeading copy={{ ...spend, note: "" }} />

      <ul className="-mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-card bg-surface-alt px-6 py-3">
        {spend.appliesTo.map((product) => (
          <li key={product} className="flex items-center gap-2">
            <Icon name="check" className="text-primary" />
            {product}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center">{spend.note}</p>

      <div aria-hidden className="mx-auto mt-8 flex h-64 max-w-md items-center justify-center rounded-t-full bg-primary-soft/50 px-4">
        <div className="flex w-full max-w-sm items-center gap-3 rounded-card bg-surface p-4 shadow-card">
          <Icon name="coins" className="text-2xl text-accent" />
          <span className="text-lg font-bold">{spend.example.label}</span>
          <span className="ml-auto text-lg text-ink-soft">{spend.example.amount}</span>
          <span className="flex h-7 w-12 items-center justify-end rounded-full bg-primary p-1">
            <span className="size-5 rounded-full bg-surface" />
          </span>
        </div>
      </div>

      <RewardsJoinButton user={user} label={joinLabel} />
    </section>
  );
};

export default RewardsSpend;
