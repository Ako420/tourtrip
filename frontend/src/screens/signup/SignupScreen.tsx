import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthCard, Skeleton, SignupForm } from "@/components";
import { authLinks } from "@/constants";
import { parseNext } from "@/lib";
import { getCurrentUser } from "@/services";
import type { RouteParams } from "@/types";

type SignupScreenProps = {
  searchParams: Promise<RouteParams>;
};

const SignupContent = async ({ searchParams }: SignupScreenProps) => {
  const next = parseNext(await searchParams);

  if (await getCurrentUser()) {
    redirect(next);
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join to unlock member coupons and rewards"
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerHref={`${authLinks.login}?next=${encodeURIComponent(next)}`}
    >
      <SignupForm next={next} />
    </AuthCard>
  );
};

const SignupScreen = ({ searchParams }: SignupScreenProps) => {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-md" />}>
      <SignupContent searchParams={searchParams} />
    </Suspense>
  );
};

export default SignupScreen;
