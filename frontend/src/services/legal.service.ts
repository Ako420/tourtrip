import { legalDocuments } from "@/data";
import type { LegalDocument, LegalSlug } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getLegalDocument = async (slug: LegalSlug): Promise<LegalDocument> => {
  return isApiLive("content") ? apiGet<LegalDocument>(`/legal/${slug}`) : legalDocuments[slug];
};
