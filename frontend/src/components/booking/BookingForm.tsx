"use client";

import { createBookingAction } from "@/actions/booking";
import { useZodForm } from "@/hooks";
import { bookingSchema } from "@/schemas";
import type { BookingStay, ContactDefaults } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import SignInToBookLink from "./SignInToBookLink";
import TermsCheckbox from "./TermsCheckbox";

type BookingFormProps = {
  stay: BookingStay;
  contact?: ContactDefaults;
};

const arrivalTimes = ["Before 2:00 PM", "2:00 PM - 6:00 PM", "6:00 PM - 10:00 PM", "After 10:00 PM"];

const inputClass =
  "w-full rounded-md border border-line bg-surface px-3 outline-none transition-colors duration-200 focus:border-primary";

const BookingForm = ({ stay, contact }: BookingFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(bookingSchema, (_state, values) =>
    createBookingAction(stay, values),
  );
  const requestsError = getError("specialRequests");

  return (
    <form {...formProps} className="flex flex-col gap-6">
      <FormMessage message={message} />

      <section className="rounded-card border border-line p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Who is staying?</h2>
          {!contact && <SignInToBookLink />}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="firstName" label="First name" autoComplete="given-name" defaultValue={contact?.firstName} error={getError("firstName")} />
          <FormField name="lastName" label="Last name" autoComplete="family-name" defaultValue={contact?.lastName} error={getError("lastName")} />
          <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
        </div>
      </section>

      <section className="rounded-card border border-line p-5">
        <h2 className="mb-4 text-lg font-bold">Your stay</h2>
        <div className="flex flex-col gap-4">
          <label className="block text-sm font-medium">
            Estimated arrival time (optional)
            <select name="arrivalTime" defaultValue="" className={`${inputClass} mt-1.5 h-12 font-normal`}>
              <option value="">Not sure yet</option>
              {arrivalTimes.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
          <div>
            <label htmlFor="specialRequests" className="mb-1.5 block text-sm font-medium">
              Special requests (optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              aria-invalid={Boolean(requestsError)}
              className={`${inputClass} py-2 ${requestsError ? "border-danger" : ""}`}
            />
            {requestsError && <p className="mt-1.5 text-sm text-danger">{requestsError}</p>}
            <p className="mt-1 text-xs text-muted">The property will try to help, but requests are not guaranteed.</p>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-line p-5">
        <h2 className="mb-2 text-lg font-bold">Payment</h2>
        <p className="flex items-start gap-3 rounded-md bg-primary-soft p-3 text-sm">
          <Icon name="credit-card" className="mt-0.5 text-primary" />
          <span>
            <strong className="block">Pay at the property</strong>
            You will not be charged now. Pay when you arrive.
          </span>
        </p>
      </section>

      <TermsCheckbox error={getError("acceptTerms")} />

      <Button type="submit" size="lg" disabled={isPending} className="disabled:opacity-60">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
};

export default BookingForm;
