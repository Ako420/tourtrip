import { legalDocuments } from "@/data";
import type { LegalDocument, LegalSlug } from "@/types";
import { apiGet, isApiEnabled } from "./http";

export const getLegalDocument = async (slug: LegalSlug): Promise<LegalDocument> => {
  return isApiEnabled ? apiGet<LegalDocument>(`/legal/${slug}`) : legalDocuments[slug];
};
