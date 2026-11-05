import { randomUUID } from "node:crypto";
import type { EnquiryRequest, EnquiryResponse } from "@/types";
import { apiPost, isApiEnabled } from "./http";

export const createEnquiry = async (enquiry: EnquiryRequest): Promise<EnquiryResponse> => {
  if (isApiEnabled) {
    return apiPost<EnquiryResponse>("/enquiries", enquiry);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
