"use client";

import { createAttractionBookingAction } from "@/actions/attractionBooking";
import { useZodForm } from "@/hooks";
import { bookingSchema } from "@/schemas";
import type { AttractionBookingTrip } from "@/types";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import LeadTravelerFields from "./LeadTravelerFields";
import OnlinePaymentNote from "./OnlinePaymentNote";
import TermsCheckbox from "./TermsCheckbox";

type AttractionBookingFormProps = {
  trip: AttractionBookingTrip;
};

const AttractionBookingForm = ({ trip }: AttractionBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(bookingSchema, (_state, values) =>
    createAttractionBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-6">
      <FormMessage message={message} />

      <LeadTravelerFields getError={getError} />

      <OnlinePaymentNote />
      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="disabled:opacity-60">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
};

export default AttractionBookingForm;
