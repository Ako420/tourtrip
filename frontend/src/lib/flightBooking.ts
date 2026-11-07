import type { FlightSearch, RouteParams } from "@/types";

export type PassengerSlot = {
  key: string;
  type: "adult" | "child";
  label: string;
};

const ADULT_AGE = 18;
const MIN_CHILD_AGE = 2;

export const getPassengerSlots = (adults: number, children: number): PassengerSlot[] => {
  const toSlots = (count: number, type: PassengerSlot["type"], label: string, offset: number) => {
    return Array.from({ length: count }, (_, index) => ({
      key: `passenger${offset + index}`,
      type,
      label: `Passenger ${offset + index + 1}: ${label}`,
    }));
  };

  return [...toSlots(adults, "adult", "Adult", 0), ...toSlots(children, "child", "Child", adults)];
};

const yearsBefore = (isoDate: string, years: number) => {
  return `${Number(isoDate.slice(0, 4)) - years}${isoDate.slice(4)}`;
};

// Ages are checked on the departure date, which is what airlines use.
export const isValidBirthDate = (birthDate: string, type: PassengerSlot["type"], departDate: string) => {
  if (type === "adult") {
    return birthDate <= yearsBefore(departDate, ADULT_AGE);
  }

  return birthDate > yearsBefore(departDate, ADULT_AGE) && birthDate <= yearsBefore(departDate, MIN_CHILD_AGE);
};

export const parseFlightBookingParams = (params: RouteParams) => {
  const getText = (value: RouteParams[string]) => (Array.isArray(value) ? value[0] : value) ?? "";

  return { offerId: getText(params.offer), reference: getText(params.reference) };
};

export const getSeatProblem = (
  offer: { seatsLeft?: number },
  search: Pick<FlightSearch, "adults" | "children">,
) => {
  const travelers = search.adults + search.children;

  return offer.seatsLeft && offer.seatsLeft < travelers
    ? `Only ${offer.seatsLeft} seats are left. Choose another option.`
    : undefined;
};
