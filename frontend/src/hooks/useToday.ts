import { useSyncExternalStore } from "react";
import { toLocalIsoDate } from "@/lib";

const subscribe = () => () => {};

// Today is the visitor's date, so it stays null on the server to keep hydration in sync.
const useToday = () => {
  return useSyncExternalStore(subscribe, () => toLocalIsoDate(new Date()), () => null);
};

export default useToday;
