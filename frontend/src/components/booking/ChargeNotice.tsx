"use client";

import { BASE_CURRENCY } from "@/constants";
import { useCurrency } from "@/hooks";

// Booking totals are always the real amount, so people who browse in another currency are told why it differs.
const ChargeNotice = () => {
  const { currency } = useCurrency();

  if (currency === BASE_CURRENCY) return null;

  return <p className="mt-2 text-xs text-muted">Bookings are in {BASE_CURRENCY}, so this total is not in {currency}.</p>;
};

export default ChargeNotice;
