import { AuthCard, LoginForm } from "@/components";
import { authLinks } from "@/constants";

const LoginScreen = () => {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your bookings"
      footerText="New to Hotel Jr?"
      footerLinkLabel="Create an account"
      footerHref={authLinks.signup}
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginScreen;
