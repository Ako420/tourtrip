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
    <form {...formProps} className="flex flex-col gap-8">
      <FormMessage message={message} />

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Who&apos;s staying?</h2>
          {!contact && <SignInToBookLink />}
        </div>
        <p className="mt-1 mb-4 text-sm">Guest names must match the ID used at check-in.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="firstName" label="First name" autoComplete="given-name" defaultValue={contact?.firstName} error={getError("firstName")} />
          <FormField name="lastName" label="Last name" autoComplete="family-name" defaultValue={contact?.lastName} error={getError("lastName")} />
          <FormField name="email" label="Email" type="email" autoComplete="email" defaultValue={contact?.email} error={getError("email")} />
          <FormField name="phone" label="Phone number" type="tel" autoComplete="tel" defaultValue={contact?.phone} error={getError("phone")} />
        </div>
        <p className="mt-2 text-sm">Your booking confirmation will be sent to this email.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Special requests <span className="text-sm font-normal">(optional)</span>
        </h2>
        <p className="mt-1 mb-4 text-sm">The property will try to help, but requests are not guaranteed.</p>
        <label className="block text-sm font-medium">
          Estimated arrival time
          <select name="arrivalTime" defaultValue="" className={`${inputClass} mt-1.5 h-12 font-normal`}>
            <option value="">Not sure yet</option>
            {arrivalTimes.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </label>
        <details open={Boolean(requestsError)} className="group mt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
            Other requests
            <Icon name="chevron-down" className="text-xs transition-transform duration-300 ease-out group-open:rotate-180" />
          </summary>
          <label htmlFor="specialRequests" className="sr-only">
            Other requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            aria-invalid={Boolean(requestsError)}
            className={`${inputClass} mt-2 py-2 ${requestsError ? "border-danger" : ""}`}
          />
          {requestsError && <p className="mt-1.5 text-sm text-danger">{requestsError}</p>}
        </details>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold">How would you like to pay?</h2>
        <p className="flex items-start gap-3 rounded-md bg-primary-soft p-3 text-sm">
          <Icon name="credit-card" className="mt-0.5 text-primary" />
          <span>
            <strong className="block">Pay at the property</strong>
            You will not be charged now. Pay when you arrive.
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

export default BookingForm;
