"use client";

import { createFlightBookingAction } from "@/actions/flightBooking";
import { useZodForm } from "@/hooks";
import { createFlightBookingSchema } from "@/schemas";
import type { ContactDefaults, FlightBookingTrip } from "@/types";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import OnlinePaymentNote from "./OnlinePaymentNote";
import TermsCheckbox from "./TermsCheckbox";
import TravelerSections from "./TravelerSections";

type FlightBookingFormProps = {
  trip: FlightBookingTrip;
  total: string;
  contact?: ContactDefaults;
};

const FlightBookingForm = ({ trip, total, contact }: FlightBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(
    createFlightBookingSchema(trip.adults, trip.children, trip.departDate),
    (_state, values) => createFlightBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-8">
      <FormMessage message={message} />

      <TravelerSections adultCount={trip.adults} childCount={trip.children} getError={getError} contact={contact} />

      <OnlinePaymentNote />

      <TermsCheckbox error={getError("acceptTerms")} />

      <div className="rounded-card bg-surface p-5">
        <p className="mb-3 flex items-baseline justify-between gap-4">
          <span className="font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">{total}</span>
        </p>
        <Button type="submit" size="lg" disabled={isPending} className="w-full text-lg disabled:opacity-60">
          {isPending ? "Booking..." : "Book now"}
        </Button>
      </div>
    </form>
  );
};

export default FlightBookingForm;
