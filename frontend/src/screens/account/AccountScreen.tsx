import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountDetails, Skeleton } from "@/components";
import { authLinks } from "@/constants";
import { getCurrentUser } from "@/services";

const AccountContent = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${authLinks.login}?next=${encodeURIComponent(authLinks.account)}`);
  }

  return <AccountDetails user={user} />;
};

const AccountScreen = () => {
  return (
    <div className="pb-8">
      <Suspense fallback={<Skeleton className="mx-auto h-64 max-w-3xl" />}>
        <AccountContent />
      </Suspense>
    </div>
  );
};

export default AccountScreen;
