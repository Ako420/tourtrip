"use client";

import Link from "next/link";
import { createFlightBookingAction } from "@/actions/flightBooking";
import { authLinks } from "@/constants";
import { useZodForm } from "@/hooks";
import { getPassengerSlots } from "@/lib";
import { createFlightBookingSchema } from "@/schemas";
import type { FlightBookingTrip } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import TermsCheckbox from "./TermsCheckbox";
import OnlinePaymentNote from "./OnlinePaymentNote";
import PassengerFields from "./PassengerFields";

type FlightBookingFormProps = {
  trip: FlightBookingTrip;
};

const FlightBookingForm = ({ trip }: FlightBookingFormProps) => {
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
          <Link href={authLinks.login} className="text-sm font-medium text-primary hover:underline">
            Sign in to book faster
          </Link>
        </div>
        <p className="mb-4 text-sm text-muted">Enter names exactly as they appear on each passport.</p>
        <div className="flex flex-col gap-4">
          {getPassengerSlots(trip.adults, trip.children).map((slot) => (
            <PassengerFields key={slot.key} slot={slot} getError={getError} />
          ))}
        </div>
      </section>

      <section className="rounded-card border border-line p-5">
        <h2 className="mb-4 text-lg font-bold">Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="email" label="Email" type="email" autoComplete="email" error={getError("email")} />
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" error={getError("phone")} />
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
