export const mapPlaceFilters = [
  { id: "all", label: "All" },
  { id: "hotel", label: "Hotels", iconName: "bed" },
  { id: "attraction", label: "Attractions", iconName: "ticket" },
] as const;

export const MAP_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_MAX_ZOOM = 19;

export const MAP_PLACE_ZOOM = 12;
