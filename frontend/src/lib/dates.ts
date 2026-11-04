const DAY_IN_MS = 86_400_000;

export const isIsoDate = (value: string) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
};

export const toLocalIsoDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

export const addDays = (isoDate: string, days: number) => {
  const time = Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_IN_MS;

  return new Date(time).toISOString().slice(0, 10);
};

export const nightsBetween = (checkIn: string, checkOut: string) => {
  return Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / DAY_IN_MS);
};
