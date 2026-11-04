"use client";

import { findBookingAction } from "@/actions/bookingLookup";
import { useZodForm } from "@/hooks";
import { bookingLookupSchema } from "@/schemas";
import type { BookingRecord } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import BookingRecordCard from "./BookingRecordCard";

const BookingLookupForm = () => {
  const { formProps, getError, isPending, message, result } = useZodForm<BookingRecord>(
    bookingLookupSchema,
    findBookingAction,
  );

  return (
    <>
      <form {...formProps} className="rounded-card border border-line p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="reference" label="Booking reference" autoComplete="off" error={getError("reference")} />
          <FormField name="email" label="Email used to book" type="email" autoComplete="email" error={getError("email")} />
        </div>
        <Button type="submit" size="lg" disabled={isPending} className="mt-4 w-full disabled:opacity-60 sm:w-auto sm:px-10">
          <Icon name="search" />
          {isPending ? "Searching..." : "Find booking"}
        </Button>
      </form>

      <div aria-live="polite" className="mt-4">
        <FormMessage message={message} />
        {result && <BookingRecordCard booking={result} />}
      </div>
    </>
  );
};

export default BookingLookupForm;
