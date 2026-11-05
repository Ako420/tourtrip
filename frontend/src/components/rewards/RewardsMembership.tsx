import { authLinks } from "@/constants";
import type { AccountUser } from "@/types";
import ButtonLink from "../ui/ButtonLink";

type RewardsMembershipProps = {
  user: AccountUser | null;
};

const rewardsPath = encodeURIComponent("/rewards");

const RewardsMembership = ({ user }: RewardsMembershipProps) => {
  const [firstName] = user?.fullName.trim().split(/\s+/) ?? [];

  return (
    <section className="mx-auto mt-6 flex max-w-content flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5">
      <div>
        <h2 className="text-lg font-bold">{user ? `Welcome, ${firstName}` : "Join for free"}</h2>
        <p className="mt-1 text-sm text-muted">
          {user
            ? "Rewards are not connected yet. Your tier, progress and Jr Coins will show here when they are."
            : "Rewards are not connected yet, so bookings do not earn coins today."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {user ? (
          <ButtonLink href={authLinks.account} size="sm" variant="outline">
            My account
          </ButtonLink>
        ) : (
          <>
            <ButtonLink href={`${authLinks.signup}?next=${rewardsPath}`} size="sm">
              Create an account
            </ButtonLink>
            <ButtonLink href={`${authLinks.login}?next=${rewardsPath}`} size="sm" variant="outline">
              Sign in
            </ButtonLink>
          </>
        )}
      </div>
    </section>
  );
};

export default RewardsMembership;
