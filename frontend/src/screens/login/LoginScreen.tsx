import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthCard, LoginForm, Skeleton } from "@/components";
import { authLinks } from "@/constants";
import { parseNext } from "@/lib";
import { getCurrentUser } from "@/services";
import type { RouteParams } from "@/types";

type LoginScreenProps = {
  searchParams: Promise<RouteParams>;
};

const LoginContent = async ({ searchParams }: LoginScreenProps) => {
  const next = parseNext(await searchParams);

  if (await getCurrentUser()) {
    redirect(next);
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your bookings"
      footerText="New to Hotel Jr?"
      footerLinkLabel="Create an account"
      footerHref={`${authLinks.signup}?next=${encodeURIComponent(next)}`}
    >
      <LoginForm next={next} />
    </AuthCard>
  );
};

const LoginScreen = ({ searchParams }: LoginScreenProps) => {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-md" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
};

export default LoginScreen;
