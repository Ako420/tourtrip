"use client";

import { createTrainBookingAction } from "@/actions/trainBooking";
import { useZodForm } from "@/hooks";
import { bookingSchema } from "@/schemas";
import type { TrainBookingTrip, ContactDefaults } from "@/types";
import FormMessage from "../auth/FormMessage";
import BookingSubmitCard from "./BookingSubmitCard";
import LeadTravelerFields from "./LeadTravelerFields";
import OnlinePaymentNote from "./OnlinePaymentNote";
import TermsCheckbox from "./TermsCheckbox";

type TrainBookingFormProps = {
  trip: TrainBookingTrip;
  total: string;
  contact?: ContactDefaults;
};

const TrainBookingForm = ({ trip, total, contact }: TrainBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(bookingSchema, (_state, values) =>
    createTrainBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-8">
      <FormMessage message={message} />
      <LeadTravelerFields getError={getError} contact={contact} />
      <OnlinePaymentNote />
      <TermsCheckbox error={getError("acceptTerms")} />

      <BookingSubmitCard total={total} isPending={isPending} />
    </form>
  );
};

export default TrainBookingForm;
