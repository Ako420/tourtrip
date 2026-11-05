import type { TrustItem } from "./flight";
import type { Section } from "./home";
import type { SupportOption } from "./support";

export type MobileAppContent = {
  hero: { title: string; subtitle: string; status: string };
  planned: Section<TrustItem> & { moreLabel: string };
  today: { title: string; items: SupportOption[] };
};
