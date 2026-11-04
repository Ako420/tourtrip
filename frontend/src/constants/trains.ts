export const TRAINS_PAGE_SIZE = 6;

export const seatClasses = ["Standard", "First"] as const;

export const trainChangeFilters = [
  { value: 0, label: "Direct" },
  { value: 1, label: "1 change" },
  { value: 2, label: "2+ changes" },
];
