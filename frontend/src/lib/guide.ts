import type { GuideFilters, RouteParams } from "@/types";

const HEADING_PREFIX = "## ";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

export const parseGuideFilters = (params: RouteParams): GuideFilters => {
  const page = Number.parseInt(getParam(params, "page") ?? "", 10);

  return {
    city: getParam(params, "city")?.trim() || undefined,
    page: page > 0 ? page : 1,
  };
};

export const toGuideHref = ({ city, page }: GuideFilters) => {
  const query = new URLSearchParams();

  if (city) query.set("city", city);
  if (page > 1) query.set("page", String(page));

  const text = query.toString();

  return text ? `/inspiration?${text}` : "/inspiration";
};

// A guide body is plain text. Blank lines split blocks, and "## " starts a heading.
export const parseGuideBody = (body: string) => {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block.startsWith(HEADING_PREFIX)
        ? { type: "heading" as const, text: block.slice(HEADING_PREFIX.length) }
        : { type: "paragraph" as const, text: block },
    );
};

export const getGuideExcerpt = (body: string) => {
  return parseGuideBody(body).find((block) => block.type === "paragraph")?.text ?? "";
};
