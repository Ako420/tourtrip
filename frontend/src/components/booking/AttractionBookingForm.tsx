"use client";

import { createAttractionBookingAction } from "@/actions/attractionBooking";
import { useZodForm } from "@/hooks";
import { bookingSchema } from "@/schemas";
import type { AttractionBookingTrip, ContactDefaults } from "@/types";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import LeadTravelerFields from "./LeadTravelerFields";
import OnlinePaymentNote from "./OnlinePaymentNote";
import TermsCheckbox from "./TermsCheckbox";

type AttractionBookingFormProps = {
  trip: AttractionBookingTrip;
  contact?: ContactDefaults;
};

const AttractionBookingForm = ({ trip, contact }: AttractionBookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(bookingSchema, (_state, values) =>
    createAttractionBookingAction(trip, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-5">
      <FormMessage message={message} />

      <LeadTravelerFields getError={getError} contact={contact} boxed />

      <section className="flex flex-col gap-4 rounded-card bg-surface p-5">
        <OnlinePaymentNote compact />
        <TermsCheckbox error={getError("acceptTerms")} />
        <Button type="submit" size="lg" disabled={isPending} className="w-full text-lg disabled:opacity-60">
          {isPending ? "Booking..." : "Book now"}
        </Button>
      </section>
    </form>
  );
};

export default AttractionBookingForm;
