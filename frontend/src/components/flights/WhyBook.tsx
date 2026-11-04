"use client";

import { useState } from "react";
import type { FlightsContent } from "@/types";
import SectionHeading from "../ui/SectionHeading";

type WhyBookProps = {
  section: FlightsContent["why"];
};

const WhyBook = ({ section }: WhyBookProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <div className="rounded-card p-5 shadow-card">
        <h3 className="font-semibold">{section.heading}</h3>
        <p className={`mt-2 text-sm text-ink-soft ${isExpanded ? "" : "line-clamp-2"}`}>{section.body}</p>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="mt-2 ml-auto block text-sm font-medium text-primary hover:underline"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    </section>
  );
};

export default WhyBook;
