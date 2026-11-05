import { logoutAction } from "@/actions/auth";
import { getInitials } from "@/lib";
import type { AccountUser } from "@/types";
import Button from "../ui/Button";
import ButtonLink from "../ui/ButtonLink";

type AccountDetailsProps = {
  user: AccountUser;
};

const AccountDetails = ({ user }: AccountDetailsProps) => {
  const details = [
    { label: "Full name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone ?? "Not added" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {getInitials(user.fullName)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold">{user.fullName}</h1>
          <p className="truncate text-muted">{user.email}</p>
        </div>
      </header>

      <section className="mt-6 rounded-card border border-line p-5">
        <h2 className="mb-3 text-lg font-bold">Your details</h2>
        <dl className="divide-y divide-line">
          {details.map((detail) => (
            <div key={detail.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <dt className="text-sm text-muted sm:w-40 sm:shrink-0">{detail.label}</dt>
              <dd className="min-w-0 font-medium break-words">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 rounded-card border border-line p-5">
        <h2 className="text-lg font-bold">Your trips</h2>
        <p className="mt-1 mb-4 text-sm text-muted">Look up a booking, or keep planning your next trip.</p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/bookings" size="sm">
            Find bookings
          </ButtonLink>
          <ButtonLink href="/planner" size="sm" variant="outline">
            Trip planner
          </ButtonLink>
        </div>
      </section>

      <form action={logoutAction} className="mt-6">
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </div>
  );
};

export default AccountDetails;
