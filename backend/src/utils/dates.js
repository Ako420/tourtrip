const DAY_IN_MS = 86_400_000;

export const addDays = (date, days) => {
  return new Date(Date.parse(date) + days * DAY_IN_MS).toISOString().slice(0, 10);
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
};
