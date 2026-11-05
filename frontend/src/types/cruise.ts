export type Cruise = {
  id: string;
  slug: string;
  name: string;
  line: string;
  destination: string;
  summary: string;
  route: string[];
  nights: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  price: number | string;
  currency: string;
};

export type CruiseSailing = {
  id: string;
  date: string;
  port: string;
  nights: number;
  price: number | string;
};

export type CruiseDetails = Cruise & {
  sailings: CruiseSailing[];
  included: string[];
  notIncluded: string[];
};

export type CruiseListing = Cruise & {
  nextSailingDate: string;
};

export type CruiseFilters = {
  query?: string;
  date?: string;
  line?: string;
};

export type CruiseSearchResult = {
  items: CruiseListing[];
  lines: string[];
};

export type CruisesContent = {
  title: string;
  subtitle: string;
  imageUrl: string;
};
