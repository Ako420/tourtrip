"use server";

import { supportTicketSchema } from "@/schemas";
import { ApiError, createSupportTicket } from "@/services";
import type { FormState, SupportTicketResponse } from "@/types";

export const sendSupportMessageAction = async (
  _state: FormState<SupportTicketResponse>,
  values: unknown,
): Promise<FormState<SupportTicketResponse>> => {
  const result = supportTicketSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  try {
    return { result: await createSupportTicket(result.data) };
  } catch (error) {
    const isLimited = error instanceof ApiError && error.status === 429;

    return {
      message: isLimited
        ? "You have sent a lot of messages. Try again later."
        : "We could not send your message. Please try again.",
    };
  }
};
