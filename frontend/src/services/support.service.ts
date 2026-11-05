import { randomUUID } from "node:crypto";
import { appPromo, supportFaqs } from "@/data";
import type { SupportFaq, SupportTicketRequest, SupportTicketResponse } from "@/types";
import { ApiError, apiGet, apiPost, isApiLive } from "./http";

export const getSupportFaqs = async (): Promise<SupportFaq[]> => {
  return isApiLive("support") ? apiGet<SupportFaq[]>("/support/faqs") : supportFaqs;
};

export const getSupportApp = async () => appPromo;

export const createSupportTicket = async (ticket: SupportTicketRequest): Promise<SupportTicketResponse> => {
  if (!isApiLive("support")) {
    return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
  }

  try {
    return await apiPost<SupportTicketResponse>("/support/tickets", ticket, { auth: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // A session that has run out shouldn't stop someone from asking for help.
      return apiPost<SupportTicketResponse>("/support/tickets", ticket);
    }

    throw error;
  }
};
