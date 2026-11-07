"use client";

import { useRouter } from "next/navigation";
import { authLinks } from "@/constants";

// The link is built on click, so people come back to this exact booking after signing in.
const SignInToBookLink = () => {
  const router = useRouter();

  const handleClick = () => {
    const next = `${window.location.pathname}${window.location.search}`;

    router.push(`${authLinks.login}?next=${encodeURIComponent(next)}`);
  };

  return (
    <button type="button" onClick={handleClick} className="text-sm font-medium text-primary hover:underline">
      Sign in to book faster
    </button>
  );
};

export default SignInToBookLink;
