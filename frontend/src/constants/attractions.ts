export const ATTRACTIONS_PAGE_SIZE = 8;

// The API rejects a longer search, so text typed into the address is limited first.
export const ATTRACTION_QUERY_LENGTH = 100;

export const attractionCategories = [
  { id: "all", label: "All", iconName: "compass" },
  { id: "landmarks", label: "Landmarks", iconName: "landmark" },
  { id: "nature", label: "Nature", iconName: "mountain" },
  { id: "adventure", label: "Adventure", iconName: "hiking" },
  { id: "city", label: "City breaks", iconName: "building" },
] as const;

export const ticketLimits = {
  adults: { min: 1, max: 10 },
  children: { min: 0, max: 10 },
};

export const attractionSortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
] as const;
