export type Guide = {
  id: string;
  slug: string;
  city: string;
  title: string;
  body: string;
  coverUrl: string;
  publishedAt: string;
};

export type GuideFilters = {
  city?: string;
  page: number;
};

export type GuideListResult = {
  items: Guide[];
  cities: string[];
  total: number;
  page: number;
  pageCount: number;
};
