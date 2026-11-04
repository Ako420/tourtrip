import { useMemo, useSyncExternalStore } from "react";
import { PLANNER_STORAGE_KEY } from "@/constants";
import { tripPlanSchema } from "@/schemas";
import type { TripPlan } from "@/types";

const listeners = new Set<() => void>();
let memoryValue: string | null = null;

const readValue = () => {
  try {
    return window.localStorage.getItem(PLANNER_STORAGE_KEY) ?? memoryValue;
  } catch {
    return memoryValue;
  }
};

const writeValue = (value: string | null) => {
  memoryValue = value;

  try {
    if (value === null) {
      window.localStorage.removeItem(PLANNER_STORAGE_KEY);
    } else {
      window.localStorage.setItem(PLANNER_STORAGE_KEY, value);
    }
  } catch {
    // Private windows can block storage, so the plan then lasts until the page closes.
  }

  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const parsePlan = (value: string | null | undefined) => {
  if (!value) return null;

  try {
    const result = tripPlanSchema.safeParse(JSON.parse(value));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

const useTripPlan = () => {
  const value = useSyncExternalStore(subscribe, readValue, () => undefined);
  const plan = useMemo(() => parsePlan(value), [value]);

  return {
    plan,
    isReady: value !== undefined,
    savePlan: (next: TripPlan) => writeValue(JSON.stringify(next)),
    clearPlan: () => writeValue(null),
  };
};

export default useTripPlan;
