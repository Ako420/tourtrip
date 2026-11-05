import { randomUUID } from "node:crypto";
import { supportFaqs } from "@/data";
import type { SupportFaq, SupportTicketRequest, SupportTicketResponse } from "@/types";
import { apiGet, apiPost, isApiEnabled } from "./http";

export const getSupportFaqs = async (): Promise<SupportFaq[]> => {
  return isApiEnabled ? apiGet<SupportFaq[]>("/support/faqs") : supportFaqs;
};

export const createSupportTicket = async (ticket: SupportTicketRequest): Promise<SupportTicketResponse> => {
  if (isApiEnabled) {
    return apiPost<SupportTicketResponse>("/support/tickets", ticket);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
