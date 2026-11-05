import Link from "next/link";
import { formatShortDate, toFlightDealHref } from "@/lib";
import type { FlightDeal } from "@/types";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type FlightDealCardProps = {
  deal: FlightDeal;
};

const FlightDealCard = ({ deal }: FlightDealCardProps) => {
  return (
    <Link
      href={toFlightDealHref(deal)}
      className="group block h-full rounded-card border border-line bg-surface p-4 transition-shadow duration-300 ease-out hover:shadow-card"
    >
      <p className="flex items-center gap-2 text-sm">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="plane" className="text-xs" />
        </span>
        {deal.airline}
        <span className="ml-auto flex items-center gap-1 text-primary">
          More
          <Icon name="chevron-right" className="text-tiny" />
        </span>
      </p>
      <h3 className="mt-3 flex flex-wrap items-center gap-x-2 text-lg font-bold group-hover:text-primary">
        {deal.from}
        <Icon name="swap" className="text-sm" />
        {deal.to}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        {formatShortDate(deal.departDate)} - {formatShortDate(deal.returnDate)}
      </p>
      <p className="text-sm text-ink-soft">
        {deal.cabin} · {deal.isNonstop ? "Nonstop" : "1 stop"}
      </p>
      <p className="mt-2 text-right text-sm text-ink-soft">
        From{" "}
        <span className="text-lg font-bold text-ink">
          <Price amount={deal.price} currency={deal.currency} />
        </span>
      </p>
    </Link>
  );
};

export default FlightDealCard;
