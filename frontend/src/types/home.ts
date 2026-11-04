import type { IconName } from "@/constants";

export type HeroGuarantee = {
  id: string;
  label: string;
  iconName: IconName;
};

export type HeroContent = {
  title: string;
  imageUrl: string;
  guarantees: HeroGuarantee[];
};

export type Promotion = {
  id: string;
  title: string;
  subtitle: string;
  terms: string;
  iconName: IconName;
  ctaLabel: string;
  ctaHref: string;
};

export type PromotionSection = {
  title: string;
  intro: { title: string; ctaLabel: string; ctaHref: string };
  items: Promotion[];
};

export type BannerTheme = "primary" | "sunset";

export type LinkItem = {
  label: string;
  href: string;
};

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  imageUrl: string;
  theme: BannerTheme;
};

export type InspirationItem = {
  id: string;
  name: string;
  tag?: string;
  imageUrl: string;
  href: string;
};

export type Place = {
  id: string;
  name: string;
  city: string;
  badge?: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  href: string;
};

export type TripMoment = {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  href: string;
};

export type Section<T> = {
  title: string;
  moreHref?: string;
  items: T[];
};

export type RecommendationTab = {
  id: string;
  label: string;
  links: LinkItem[];
};

export type HomeContent = {
  hero: HeroContent;
  promotions: PromotionSection;
  banners: Banner[];
  inspiration: Section<InspirationItem>;
  places: Section<Place>;
  moments: Section<TripMoment>;
  handpickedHotels: { title: string; moreHref: string };
  recommendations: Section<RecommendationTab>;
};
