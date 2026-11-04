export const formatPrice = (amount: number | string, currency: string) => {
  const value = Number(amount);

  // Whole prices stay short, but cents are never rounded away.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
};

export const formatShortDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
};

export const formatCount = (count: number, singular: string, plural = `${singular}s`) => {
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : plural}`;
};

export const getRatingLabel = (rating: number) => {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  return "Pleasant";
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};

export const formatClockTime = (minutes: number) => {
  const dayMinutes = minutes % 1440;
  const hours = String(Math.floor(dayMinutes / 60)).padStart(2, "0");

  return `${hours}:${String(dayMinutes % 60).padStart(2, "0")}`;
};
