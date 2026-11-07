import { useCallback, useSyncExternalStore } from "react";
import { BASE_CURRENCY, CURRENCY_STORAGE_KEY, currencies } from "@/constants";
import { convertPrice, formatPrice } from "@/lib";

const listeners = new Set<() => void>();
let memoryValue: string | null = null;

const readValue = () => {
  try {
    return window.localStorage.getItem(CURRENCY_STORAGE_KEY) ?? memoryValue;
  } catch {
    return memoryValue;
  }
};

const getSnapshot = () => {
  const code = readValue();

  return currencies.some((currency) => currency.code === code) ? (code as string) : BASE_CURRENCY;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const setCurrency = (code: string) => {
  memoryValue = code;

  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // Private windows can block storage, so the choice lasts until the page closes.
  }

  listeners.forEach((listener) => listener());
};

// The server always renders the base currency, so saved choices apply once the page loads.
const useCurrency = () => {
  const currency = useSyncExternalStore(subscribe, getSnapshot, () => BASE_CURRENCY);

  const format = useCallback(
    (amount: number | string, from: string) => {
      return currency === from ? formatPrice(amount, from) : convertPrice(amount, from, currency);
    },
    [currency],
  );

  return { currency, setCurrency, format };
};

export default useCurrency;
