import Link from "next/link";
import { formatPrice, formatShortDate } from "@/lib";
import type { FlightDeal } from "@/types";
import Icon from "../ui/Icon";

type FlightDealCardProps = {
  deal: FlightDeal;
};

const FlightDealCard = ({ deal }: FlightDealCardProps) => {
  const query = new URLSearchParams({
    from: deal.from,
    to: deal.to,
    departDate: deal.departDate,
    returnDate: deal.returnDate,
    cabin: deal.cabin,
  });
  const href = `/flights/results?${query}`;

  return (
    <Link href={href} className="group block h-full rounded-card border border-line p-4 transition-shadow duration-300 ease-out hover:shadow-card">
      <p className="flex items-center gap-2 text-xs text-muted">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="plane" className="text-[0.625rem]" />
        </span>
        {deal.airline}
        <span className="ml-auto text-primary">More</span>
      </p>
      <h3 className="mt-3 flex flex-wrap items-center gap-x-2 font-semibold group-hover:text-primary">
        {deal.from}
        <Icon name="swap" className="text-xs" />
        {deal.to}
      </h3>
      <p className="mt-1 text-xs text-muted">
        {formatShortDate(deal.departDate)} - {formatShortDate(deal.returnDate)}
      </p>
      <p className="text-xs text-muted">
        {deal.cabin} · {deal.isNonstop ? "Nonstop" : "1 stop"}
      </p>
      <p className="mt-3 text-right text-xs text-muted">
        From <span className="text-lg font-bold text-ink">{formatPrice(deal.price, deal.currency)}</span>
      </p>
    </Link>
  );
};

export default FlightDealCard;
