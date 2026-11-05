"use client";

import { useState } from "react";
import type { FlightDeal } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import StatusMessage from "../ui/StatusMessage";
import FlightDealCard from "./FlightDealCard";

type FlightDealsProps = {
  title: string;
  deals: FlightDeal[];
};

const INITIAL_COUNT = 8;

const FlightDeals = ({ title, deals }: FlightDealsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleDeals = isExpanded ? deals : deals.slice(0, INITIAL_COUNT);

  return (
    <section id="deals" className="mx-auto mt-12 max-w-content scroll-mt-4">
      <SectionHeading>{title}</SectionHeading>
      <p className="-mt-3 mb-4 text-sm text-muted">Airlines and fares are samples.</p>

      {deals.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleDeals.map((deal) => (
            <li key={deal.id}>
              <FlightDealCard deal={deal} />
            </li>
          ))}
        </ul>
      ) : (
        <StatusMessage
          iconName="plane"
          title="No deals found"
          description="Try a different route, or turn off the nonstop filter."
        />
      )}

      {deals.length > INITIAL_COUNT && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="mx-auto mt-4 flex items-center gap-2 text-sm font-bold hover:text-primary"
        >
          {isExpanded ? "Show less" : "Show more"}
          <Icon name="chevron-down" className={`text-xs transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  );
};

export default FlightDeals;
