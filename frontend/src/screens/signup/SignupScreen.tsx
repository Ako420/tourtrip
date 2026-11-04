import { AuthCard, SignupForm } from "@/components";
import { authLinks } from "@/constants";

const SignupScreen = () => {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join to unlock member coupons and rewards"
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerHref={authLinks.login}
    >
      <SignupForm />
    </AuthCard>
  );
};

export default SignupScreen;
