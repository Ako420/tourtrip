"use client";

import { sendSupportMessageAction } from "@/actions/support";
import { supportTopics } from "@/constants";
import { useZodForm } from "@/hooks";
import { supportTicketSchema } from "@/schemas";
import type { ContactDefaults, SupportTicketResponse } from "@/types";
import FormField from "../auth/FormField";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type SupportFormProps = {
  contact?: ContactDefaults;
};

const inputClass =
  "w-full rounded-md border bg-surface px-3 outline-none transition-colors duration-200 focus:border-primary";

const SupportForm = ({ contact }: SupportFormProps) => {
  const { formProps, getError, isPending, message, result } = useZodForm<SupportTicketResponse>(
    supportTicketSchema,
    sendSupportMessageAction,
  );
  const topicError = getError("topic");
  const messageError = getError("message");

  if (result) {
    const isDemo = result.reference.startsWith("DEMO-");

    return (
      <div role="status" className="rounded-card border border-line p-6 text-center">
        <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="check" />
        </span>
        <h3 className="text-lg font-bold">{isDemo ? "Demo message received" : "Message sent"}</h3>
        <p className="mt-1 text-sm text-muted">
          {isDemo
            ? "Support is not connected yet, so this message was not sent to a team."
            : "Our team will reply to your email."}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue=""
            aria-invalid={Boolean(topicError)}
            className={`${inputClass} h-12 ${topicError ? "border-danger" : "border-line"}`}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {supportTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          {topicError && <p className="mt-1.5 text-sm text-danger">{topicError}</p>}
        </div>
        <FormField
          name="bookingReference"
          label="Booking reference (optional)"
          autoComplete="off"
          error={getError("bookingReference")}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(messageError)}
          className={`${inputClass} py-2 ${messageError ? "border-danger" : "border-line"}`}
        />
        {messageError && <p className="mt-1.5 text-sm text-danger">{messageError}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full disabled:opacity-60 sm:w-auto sm:self-start sm:px-10">
        <Icon name="send" />
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
};

export default SupportForm;
