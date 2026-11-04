import { tripStyles } from "@/constants";
import type { PlanActivity, PlanItem, PlannerSuggestion, TripPlan, TripSetup } from "@/types";
import { addDays, nightsBetween } from "./dates";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const updateDay = (plan: TripPlan, dayIndex: number, getItems: (items: PlanItem[]) => PlanItem[]): TripPlan => {
  return {
    ...plan,
    days: plan.days.map((day, index) => (index === dayIndex ? { ...day, items: getItems(day.items) } : day)),
  };
};

const toPlanItem = (suggestion: PlannerSuggestion): PlanItem => {
  return {
    id: createId(),
    suggestionId: suggestion.id,
    title: suggestion.name,
    cost: suggestion.price,
    note: suggestion.duration,
    href: `/attractions/${suggestion.slug}`,
  };
};

const sortByTime = (items: PlanItem[]) => {
  return items.toSorted((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
};

export const createTripPlan = (setup: TripSetup, currency: string): TripPlan => {
  const dayCount = nightsBetween(setup.startDate, setup.endDate) + 1;

  return {
    ...setup,
    currency,
    days: Array.from({ length: dayCount }, (_, index) => ({ date: addDays(setup.startDate, index), items: [] })),
  };
};

export const addSuggestion = (plan: TripPlan, dayIndex: number, suggestion: PlannerSuggestion) => {
  return updateDay(plan, dayIndex, (items) => [...items, toPlanItem(suggestion)]);
};

export const addActivity = (plan: TripPlan, dayIndex: number, activity: PlanActivity) => {
  const item = { ...activity, id: createId(), time: activity.time || undefined, note: activity.note || undefined };

  return updateDay(plan, dayIndex, (items) => sortByTime([...items, item]));
};

export const removeItem = (plan: TripPlan, dayIndex: number, itemId: string) => {
  return updateDay(plan, dayIndex, (items) => items.filter((item) => item.id !== itemId));
};

export const moveItem = (plan: TripPlan, dayIndex: number, itemId: string, direction: 1 | -1) => {
  return updateDay(plan, dayIndex, (items) => {
    const from = items.findIndex((item) => item.id === itemId);
    const to = from + direction;

    if (from < 0 || to < 0 || to >= items.length) return items;

    const next = [...items];

    [next[from], next[to]] = [next[to], next[from]];

    return next;
  });
};

export const getPlannedIds = (plan: TripPlan) => {
  return new Set(plan.days.flatMap((day) => day.items.flatMap((item) => item.suggestionId ?? [])));
};

// Tops each day up to the trip style without repeating anything already planned.
export const fillEmptySlots = (plan: TripPlan, suggestions: PlannerSuggestion[]) => {
  const perDay = tripStyles.find((style) => style.value === plan.style)?.perDay ?? 1;
  const planned = getPlannedIds(plan);
  const available = suggestions.filter((suggestion) => !planned.has(suggestion.id));

  return {
    ...plan,
    days: plan.days.map((day) => {
      const extra = available.splice(0, Math.max(perDay - day.items.length, 0));

      return { ...day, items: [...day.items, ...extra.map(toPlanItem)] };
    }),
  };
};

export const getDayTotal = (items: PlanItem[]) => items.reduce((total, item) => total + item.cost, 0);

export const getPlanTotal = (plan: TripPlan) => {
  return plan.days.reduce((total, day) => total + getDayTotal(day.items), 0);
};

export const matchesDestination = (suggestion: PlannerSuggestion, destination: string) => {
  const query = destination.trim().toLowerCase();

  return [suggestion.city, suggestion.country, suggestion.name].some((value) => {
    const text = value.toLowerCase();

    return text.includes(query) || query.includes(text);
  });
};
