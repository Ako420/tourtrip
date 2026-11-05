"use client";

import { sendEnquiryAction } from "@/actions/enquiry";
import { enquiryLimits } from "@/constants";
import { useToday, useZodForm } from "@/hooks";
import { enquirySchema } from "@/schemas";
import type { ContactDefaults, EnquiryResponse, EnquirySubject } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type EnquiryFormProps = {
  subject: EnquirySubject;
  dateOptions?: { value: string; label: string }[];
  contact?: ContactDefaults;
};

const inputClass =
  "w-full rounded-md border bg-surface px-3 outline-none transition-colors duration-200 focus:border-primary";

const EnquiryForm = ({ subject, dateOptions, contact }: EnquiryFormProps) => {
  const today = useToday();
  const { formProps, getError, isPending, message, result } = useZodForm<EnquiryResponse>(
    enquirySchema,
    (_state, values) => sendEnquiryAction(subject, values),
  );
  const dateError = getError("date");
  const messageError = getError("message");

  if (result) {
    const isDemo = result.reference.startsWith("DEMO-");

    return (
      <div role="status" className="rounded-card border border-line p-6 text-center">
        <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="check" />
        </span>
        <h3 className="text-lg font-bold">{isDemo ? "Demo enquiry received" : "Enquiry sent"}</h3>
        <p className="mt-1 text-sm text-muted">
          {isDemo ? "Enquiries are not connected yet, so this was not sent to a team." : "Our team will reply to your email."}
        </p>
        <p className="mt-3 text-sm">
          Reference: <strong>{result.reference}</strong>
        </p>
      </div>
    );
  }

  return (
    <form {...formProps} className="flex flex-col gap-4 rounded-card border border-line p-5">
      <FormMessage message={message} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          name="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={contact && `${contact.firstName} ${contact.lastName}`.trim()}
          error={getError("fullName")}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          defaultValue={contact?.email}
          error={getError("email")}
        />

        {dateOptions ? (
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
              Departure
            </label>
            <select
              id="date"
              name="date"
              defaultValue=""
              aria-invalid={Boolean(dateError)}
              className={`${inputClass} h-12 ${dateError ? "border-danger" : "border-line"}`}
            >
              <option value="" disabled>
                Choose a departure
              </option>
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {dateError && <p className="mt-1.5 text-sm text-danger">{dateError}</p>}
          </div>
        ) : (
          <FormField name="date" label="Preferred start date" type="date" min={today ?? undefined} error={dateError} />
        )}

        <FormField
          name="travelers"
          label="Travelers"
          type="number"
          inputMode="numeric"
          min={enquiryLimits.minTravelers}
          max={enquiryLimits.maxTravelers}
          defaultValue={2}
          error={getError("travelers")}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Anything we should know? (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          aria-invalid={Boolean(messageError)}
          className={`${inputClass} py-2 ${messageError ? "border-danger" : "border-line"}`}
        />
        {messageError && <p className="mt-1.5 text-sm text-danger">{messageError}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full disabled:opacity-60 sm:w-auto sm:self-start sm:px-10">
        <Icon name="send" />
        {isPending ? "Sending..." : "Send enquiry"}
      </Button>
    </form>
  );
};

export default EnquiryForm;
