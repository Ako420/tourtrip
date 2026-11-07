import type { AccountUser, RewardsProgram } from "@/types";
import Icon from "../ui/Icon";
import RewardsJoinButton from "./RewardsJoinButton";

type RewardsMembershipProps = {
  user: AccountUser | null;
  membership: RewardsProgram["membership"];
  joinLabel: string;
};

const RewardsMembership = ({ user, membership, joinLabel }: RewardsMembershipProps) => {
  const [firstName] = user?.fullName.trim().split(/\s+/) ?? [];

  return (
    <section className="relative -mt-9 mx-auto max-w-content rounded-panel bg-surface p-6 shadow-card sm:p-10">
      <h2 className="text-center type-section-lg font-bold">{user ? `Welcome, ${firstName}` : membership.title}</h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-[18rem_1fr] lg:items-center">
        <div className="flex items-center gap-4 rounded-card bg-surface-alt p-6">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-line text-2xl text-muted">
            <Icon name="user" />
          </span>
          <div>
            <h3 className="text-2xl font-bold text-ink-soft">{membership.guest.title}</h3>
            <p className="mt-1 text-ink-soft">{membership.guest.detail}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-card bg-primary-soft p-8">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-surface text-3xl text-primary">
            <Icon name="gem" />
          </span>
          <div>
            <h3 className="text-2xl font-bold text-primary">{membership.member.title}</h3>
            <p className="mt-1 text-ink-soft">{membership.member.detail}</p>
          </div>
        </div>
      </div>

      <RewardsJoinButton user={user} label={joinLabel} />
      <p className="mt-3 text-center text-sm text-muted">{user ? membership.memberNote : membership.note}</p>
    </section>
  );
};

export default RewardsMembership;
