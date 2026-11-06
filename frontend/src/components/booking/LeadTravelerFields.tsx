import type { ContactDefaults } from "@/types";
import FormField from "../auth/FormField";
import SignInToBookLink from "./SignInToBookLink";

type LeadTravelerFieldsProps = {
  getError: (name: string) => string | undefined;
  contact?: ContactDefaults;
};

const LeadTravelerFields = ({ getError, contact }: LeadTravelerFieldsProps) => {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Lead traveler</h2>
        {!contact && <SignInToBookLink />}
      </div>
      <p className="mt-1 mb-4 text-sm">We only need one person&apos;s details for the whole group.</p>
      <div className="grid gap-4 rounded-card border border-line bg-surface p-5 sm:grid-cols-2">
        <FormField name="firstName" label="First name" autoComplete="given-name" defaultValue={contact?.firstName} error={getError("firstName")} />
        <FormField name="lastName" label="Last name" autoComplete="family-name" defaultValue={contact?.lastName} error={getError("lastName")} />
        <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
        <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
      </div>
    </section>
  );
};

export default LeadTravelerFields;
