import { randomUUID } from "node:crypto";
import { supportFaqs } from "@/data";
import type { SupportFaq, SupportTicketRequest, SupportTicketResponse } from "@/types";
import { apiGet, apiPost, isApiLive } from "./http";

export const getSupportFaqs = async (): Promise<SupportFaq[]> => {
  return isApiLive("support") ? apiGet<SupportFaq[]>("/support/faqs") : supportFaqs;
};

export const createSupportTicket = async (ticket: SupportTicketRequest): Promise<SupportTicketResponse> => {
  if (isApiLive("support")) {
    return apiPost<SupportTicketResponse>("/support/tickets", ticket);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
