export const ATTRACTIONS_PAGE_SIZE = 8;

export const attractionCategories = [
  { id: "all", label: "All", iconName: "compass" },
  { id: "landmarks", label: "Landmarks", iconName: "landmark" },
  { id: "nature", label: "Nature", iconName: "mountain" },
  { id: "adventure", label: "Adventure", iconName: "hiking" },
  { id: "city", label: "City breaks", iconName: "building" },
] as const;

export const attractionSortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
] as const;
