import { Suspense } from "react";
import { AccountMenu, SignInButton } from "@/components";
import { getCurrentUser } from "@/services";

type AccountNavProps = {
  variant?: "primary" | "inverse";
};

const AccountNavContent = async ({ variant }: AccountNavProps) => {
  const user = await getCurrentUser();

  return user ? <AccountMenu user={user} variant={variant} /> : <SignInButton variant={variant} />;
};

// The session is read at request time, so the rest of the page stays cached.
const AccountNav = ({ variant }: AccountNavProps) => {
  return (
    <Suspense fallback={<SignInButton variant={variant} />}>
      <AccountNavContent variant={variant} />
    </Suspense>
  );
};

export default AccountNav;
