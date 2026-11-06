import { getPassengerSlots } from "@/lib";
import type { ContactDefaults } from "@/types";
import FormField from "../auth/FormField";
import PassengerFields from "./PassengerFields";
import SignInToBookLink from "./SignInToBookLink";

type TravelerSectionsProps = {
  adultCount: number;
  childCount: number;
  getError: (name: string) => string | undefined;
  contact?: ContactDefaults;
};

const TravelerSections = ({ adultCount, childCount, getError, contact }: TravelerSectionsProps) => {
  return (
    <>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Who&apos;s traveling?</h2>
          {!contact && <SignInToBookLink />}
        </div>
        <p className="mt-1 mb-4 text-sm">Names must match ID. Enter them exactly as they appear on each passport.</p>
        <div className="flex flex-col gap-4">
          {getPassengerSlots(adultCount, childCount).map((slot, index) => (
            <PassengerFields key={slot.key} slot={slot} getError={getError} contact={index === 0 ? contact : undefined} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Contact details</h2>
        <div className="grid gap-4 rounded-card border border-line bg-surface p-5 sm:grid-cols-2">
          <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
        </div>
      </section>
    </>
  );
};

export default TravelerSections;
