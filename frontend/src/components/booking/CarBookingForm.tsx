"use client";

import { createCarBookingAction } from "@/actions/carBooking";
import { useZodForm } from "@/hooks";
import { createCarBookingSchema } from "@/schemas";
import type { CarBookingTrip, ContactDefaults } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import SignInToBookLink from "./SignInToBookLink";
import TermsCheckbox from "./TermsCheckbox";

type CarBookingFormProps = {
  trip: CarBookingTrip;
  contact?: ContactDefaults;
};

const CarBookingForm = ({ trip, contact }: CarBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(
    createCarBookingSchema(trip.pickupDate, trip.isStandardAge),
    (_state, values) => createCarBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-4">
      <FormMessage message={message} />

      <section className="rounded-card bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Driver details</h2>
          {!contact && <SignInToBookLink />}
        </div>
        <p className="mt-1 mb-4 text-sm">Enter the name exactly as it appears on the driving license.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="firstName" label="First name" autoComplete="given-name" defaultValue={contact?.firstName} error={getError("firstName")} />
          <FormField name="lastName" label="Last name" autoComplete="family-name" defaultValue={contact?.lastName} error={getError("lastName")} />
          <FormField name="birthDate" label="Date of birth" type="date" autoComplete="bday" error={getError("birthDate")} />
        </div>
      </section>

      <section className="rounded-card bg-surface p-5">
        <h2 className="mb-4 text-2xl font-bold">Contact info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
          <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
        </div>
      </section>

      <section className="rounded-card bg-surface p-5">
        <h2 className="mb-3 text-xl font-bold">How would you like to pay?</h2>
        <p className="flex items-start gap-3 rounded-md bg-primary-soft p-3 text-sm">
          <Icon name="credit-card" className="mt-0.5 text-primary" />
          <span>
            <strong className="block">Pay at the rental counter</strong>
            You will not be charged now. Bring a driving license and a card in the driver&apos;s name.
          </span>
        </p>
      </section>

      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="w-full text-lg disabled:opacity-60">
        {isPending ? "Booking..." : "Book now"}
      </Button>
    </form>
  );
};

export default CarBookingForm;
