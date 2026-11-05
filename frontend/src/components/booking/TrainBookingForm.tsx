"use client";

import { createTrainBookingAction } from "@/actions/trainBooking";
import { useZodForm } from "@/hooks";
import { bookingSchema } from "@/schemas";
import type { TrainBookingTrip, ContactDefaults } from "@/types";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import LeadTravelerFields from "./LeadTravelerFields";
import OnlinePaymentNote from "./OnlinePaymentNote";
import TermsCheckbox from "./TermsCheckbox";

type TrainBookingFormProps = {
  trip: TrainBookingTrip;
  contact?: ContactDefaults;
};

const TrainBookingForm = ({ trip, contact }: TrainBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(bookingSchema, (_state, values) =>
    createTrainBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-6">
      <FormMessage message={message} />
      <LeadTravelerFields getError={getError} contact={contact} />
      <OnlinePaymentNote />
      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="disabled:opacity-60">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
};

export default TrainBookingForm;
