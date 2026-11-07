"use client";

import { useCurrency } from "@/hooks";

type PriceProps = {
  amount: number | string;
  currency: string;
};

const Price = ({ amount, currency }: PriceProps) => {
  return useCurrency().format(amount, currency);
};

export default Price;
