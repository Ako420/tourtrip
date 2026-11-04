"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { ticketLimits } from "@/constants";
import { useToday } from "@/hooks";
import { formatCount, formatPrice } from "@/lib";
import { ticketSelectionSchema } from "@/schemas";
import type { AttractionDetails, TicketOption } from "@/types";
import CounterRow from "../search/CounterRow";
import DateField from "../search/DateField";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type TicketSelectorProps = {
  attraction: AttractionDetails;
};

const TicketSelector = ({ attraction }: TicketSelectorProps) => {
  const router = useRouter();
  const today = useToday();
  const [date, setDate] = useState<string>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [dateError, setDateError] = useState<string>();

  const getTotal = (ticket: TicketOption) => {
    return Number(ticket.adultPrice) * adults + Number(ticket.childPrice) * children;
  };

  const handleBook = (ticket: TicketOption) => {
    const result = ticketSelectionSchema.safeParse({ date: date ?? "", today: today ?? "", adults, children });

    if (!result.success) {
      setDateError(z.flattenError(result.error).fieldErrors.date?.[0]);
      document.getElementById("tickets")?.scrollIntoView();
      return;
    }

    const query = new URLSearchParams({
      ticket: ticket.id,
      date: result.data.date,
      adults: String(adults),
      children: String(children),
    });

    router.push(`/attractions/${attraction.slug}/book?${query}`);
  };

  return (
    <section id="tickets" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-bold">Choose your tickets</h2>

      <div className="mb-4 grid gap-4 rounded-card border border-line p-4 md:grid-cols-[1fr_1fr_1fr]">
        <div>
          <p className="mb-2 text-sm font-medium">Visit date</p>
          <div className={`flex h-10 items-center gap-3 rounded-md border px-3 text-sm ${dateError ? "border-danger" : "border-line"}`}>
            <Icon name="calendar" className="text-ink-soft" />
            <DateField
              label="Choose a date"
              value={date}
              min={today ?? undefined}
              onChange={(value) => {
                setDate(value);
                setDateError(undefined);
              }}
            />
          </div>
          {dateError && <p className="mt-1.5 text-sm text-danger">{dateError}</p>}
        </div>
        <CounterRow label="Adults" value={adults} {...ticketLimits.adults} onChange={setAdults} />
        <CounterRow label="Children" value={children} {...ticketLimits.children} onChange={setChildren} />
      </div>

      <ul className="flex flex-col gap-4">
        {attraction.tickets.map((ticket) => (
          <li key={ticket.id} className="flex flex-col gap-3 rounded-card border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">{ticket.name}</h3>
              <p className="text-sm text-muted">{ticket.description}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                {ticket.includes.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Icon name="check" className="text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              {attraction.freeCancellation && <p className="mt-1 text-sm text-success">Free cancellation</p>}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div className="sm:text-right">
                <p className="text-2xl font-bold text-primary">{formatPrice(getTotal(ticket), attraction.currency)}</p>
                <p className="text-xs text-muted">
                  Total for {formatCount(adults + children, "guest")} · {formatPrice(ticket.adultPrice, attraction.currency)} per adult,{" "}
                  {formatPrice(ticket.childPrice, attraction.currency)} per child
                </p>
              </div>
              <Button type="button" size="sm" onClick={() => handleBook(ticket)}>
                Book
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TicketSelector;
