const DAY_IN_MS = 86_400_000;

export const isIsoDate = (value: string) => {
  const time = Date.parse(`${value}T00:00:00Z`);

  // Date.parse rolls 30 February on to March, so a real date has to come back unchanged.
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
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
