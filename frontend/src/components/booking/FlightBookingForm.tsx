"use client";

import { createFlightBookingAction } from "@/actions/flightBooking";
import { useZodForm } from "@/hooks";
import { createFlightBookingSchema } from "@/schemas";
import type { ContactDefaults, FlightBookingTrip } from "@/types";
import FormMessage from "../auth/FormMessage";
import BookingSubmitCard from "./BookingSubmitCard";
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

      <BookingSubmitCard total={total} isPending={isPending} />
    </form>
  );
};

export default FlightBookingForm;
