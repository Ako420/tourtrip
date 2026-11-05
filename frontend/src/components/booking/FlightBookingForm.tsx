"use client";

import { createFlightBookingAction } from "@/actions/flightBooking";
import { useZodForm } from "@/hooks";
import { getPassengerSlots } from "@/lib";
import { createFlightBookingSchema } from "@/schemas";
import type { ContactDefaults, FlightBookingTrip } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import SignInToBookLink from "./SignInToBookLink";
import TermsCheckbox from "./TermsCheckbox";
import OnlinePaymentNote from "./OnlinePaymentNote";
import PassengerFields from "./PassengerFields";

type FlightBookingFormProps = {
  trip: FlightBookingTrip;
  contact?: ContactDefaults;
};

const FlightBookingForm = ({ trip, contact }: FlightBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(
    createFlightBookingSchema(trip.adults, trip.children, trip.departDate),
    (_state, values) => createFlightBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-6">
      <FormMessage message={message} />

      <section className="rounded-card border border-line p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Who is flying?</h2>
          {!contact && <SignInToBookLink />}
        </div>
        <p className="mb-4 text-sm text-muted">Enter names exactly as they appear on each passport.</p>
        <div className="flex flex-col gap-4">
          {getPassengerSlots(trip.adults, trip.children).map((slot, index) => (
            <PassengerFields key={slot.key} slot={slot} getError={getError} contact={index === 0 ? contact : undefined} />
          ))}
        </div>
      </section>

      <section className="rounded-card border border-line p-5">
        <h2 className="mb-4 text-lg font-bold">Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
        </div>
      </section>

      <OnlinePaymentNote />

      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="disabled:opacity-60">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
};

export default FlightBookingForm;
