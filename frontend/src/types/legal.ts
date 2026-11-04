export type LegalSlug = "terms" | "privacy";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDocument = {
  slug: LegalSlug;
  title: string;
  summary: string;
  updatedOn: string;
  isDraft: boolean;
  sections: LegalSection[];
};
