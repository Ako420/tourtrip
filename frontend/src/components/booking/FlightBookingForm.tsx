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

      <TravelerSections adultCount={trip.adults} childCount={trip.children} getError={getError} contact={contact} />

      <OnlinePaymentNote />

      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="disabled:opacity-60">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
};

export default FlightBookingForm;
