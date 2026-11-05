import { authLinks } from "@/constants";
import ButtonLink from "../ui/ButtonLink";

type SignInButtonProps = {
  variant?: "primary" | "inverse";
};

const SignInButton = ({ variant = "primary" }: SignInButtonProps) => {
  return (
    <ButtonLink href={authLinks.login} variant={variant} size="sm">
      Sign in/register
    </ButtonLink>
  );
};

export default SignInButton;
