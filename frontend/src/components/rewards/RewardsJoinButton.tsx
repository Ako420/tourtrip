import { authLinks } from "@/constants";
import type { AccountUser } from "@/types";
import ButtonLink from "../ui/ButtonLink";

type RewardsJoinButtonProps = {
  user: AccountUser | null;
  label: string;
};

const rewardsPath = encodeURIComponent("/rewards");

const RewardsJoinButton = ({ user, label }: RewardsJoinButtonProps) => {
  return (
    <div className="mt-8 flex justify-center">
      <ButtonLink
        href={user ? authLinks.account : `${authLinks.signup}?next=${rewardsPath}`}
        size="lg"
        className="w-full max-w-80 text-lg"
      >
        {user ? "My account" : label}
      </ButtonLink>
    </div>
  );
};

export default RewardsJoinButton;
