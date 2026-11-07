import type { FlightTip, TrustItem } from "./flight";
import type { RecommendationTab, Section } from "./home";

export type HotelsContent = {
  hero: { title: string; imageUrl: string };
  offer: { title: string; points: string[]; ctaLabel: string; ctaHref: string };
  whatsNewTitle: string;
  benefits: TrustItem[];
  showcases: { luxuryTitle: string; budgetTitle: string; popularTitle: string };
  faqs: Section<FlightTip>;
  statsTitle: string;
  about: { title: string; paragraphs: string[] };
  recommendations: Section<RecommendationTab>;
};
