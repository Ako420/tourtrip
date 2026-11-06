"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { ticketLimits } from "@/constants";
import { useToday } from "@/hooks";
import { formatCount } from "@/lib";
import { ticketSelectionSchema } from "@/schemas";
import type { AttractionDetails } from "@/types";
import CounterRow from "../search/CounterRow";
import DateField from "../search/DateField";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

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
  const [ticket, setTicket] = useState(attraction.tickets[0]);

  const total = Number(ticket.adultPrice) * adults + Number(ticket.childPrice) * children;

  const handleBook = () => {
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
    <section id="tickets" className="scroll-mt-32 rounded-card bg-surface p-5">
      <h2 className="text-2xl font-bold">Tickets and price</h2>

      <h3 className="mt-5 mb-2 text-lg font-bold">Date of visit</h3>
      <div className={`flex h-10 items-center gap-3 rounded-md border px-3 text-sm sm:w-72 ${dateError ? "border-danger" : "border-line"}`}>
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

      <h3 className="mt-6 mb-2 text-lg font-medium">Ticket options</h3>
      <ul className="grid gap-3 sm:grid-cols-3">
        {attraction.tickets.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              aria-pressed={option.id === ticket.id}
              onClick={() => setTicket(option)}
              className={`h-full w-full rounded-md border p-3 text-left text-sm transition-colors duration-300 ease-out ${
                option.id === ticket.id ? "border-primary bg-primary-soft" : "border-line hover:border-primary"
              }`}
            >
              <span className="block font-semibold">{option.name}</span>
              <span className="mt-1 block text-ink-soft">
                <Price amount={option.adultPrice} currency={attraction.currency} /> per adult
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-md bg-surface-alt p-3 text-sm">
        <p>{ticket.description}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {ticket.includes.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Icon name="check" className="text-success" />
              {item}
            </li>
          ))}
        </ul>
        {attraction.freeCancellation && <p className="mt-1 text-success">Free cancellation</p>}
      </div>

      <h3 className="mt-6 mb-1 text-lg font-bold">Quantity</h3>
      <CounterRow label="Adults" value={adults} {...ticketLimits.adults} onChange={setAdults} />
      <CounterRow label="Children" value={children} {...ticketLimits.children} onChange={setChildren} />
      <p className="text-sm text-ink-soft">
        <Price amount={ticket.adultPrice} currency={attraction.currency} /> per adult,{" "}
        <Price amount={ticket.childPrice} currency={attraction.currency} /> per child
      </p>

      <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-4">
        <div className="text-right">
          <p className="type-price font-bold text-primary">
            <Price amount={total} currency={attraction.currency} />
          </p>
          <p className="text-sm text-ink-soft">Total for {formatCount(adults + children, "guest")}</p>
        </div>
        <Button type="button" size="lg" onClick={handleBook}>
          Book now
        </Button>
      </div>
    </section>
  );
};

export default TicketSelector;
