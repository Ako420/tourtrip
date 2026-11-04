import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  children: ReactNode;
};

const AuthCard = ({ title, subtitle, footerText, footerLinkLabel, footerHref, children }: AuthCardProps) => {
  return (
    <section className="mx-auto w-full max-w-md rounded-panel border border-line bg-surface p-6 shadow-card sm:mt-8 sm:p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 mb-6 text-muted">{subtitle}</p>
      {children}
      <p className="mt-6 text-center text-sm text-muted">
        {footerText}{" "}
        <Link href={footerHref} className="font-medium text-primary hover:underline">
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  );
};

export default AuthCard;
