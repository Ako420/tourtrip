import { randomUUID } from "node:crypto";
import type { EnquiryRequest, EnquiryResponse } from "@/types";
import { apiPost, isApiLive } from "./http";

export const createEnquiry = async (enquiry: EnquiryRequest): Promise<EnquiryResponse> => {
  if (isApiLive("tours")) {
    return apiPost<EnquiryResponse>("/enquiries", enquiry);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
