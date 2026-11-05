"use client";

import { useState } from "react";
import type { CarsContent } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

type CarGuideProps = {
  section: CarsContent["guide"];
};

const CarGuide = ({ section }: CarGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <div className="rounded-card bg-surface p-4 shadow-card">
        <div className={`relative overflow-hidden ${isOpen ? "" : "max-h-64"}`}>
          <div className="space-y-6">
            {section.items.map((item) => (
              <article key={item.id}>
                <h3 className="type-section font-semibold">{item.title}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-sm text-ink-soft">
                    {paragraph}
                  </p>
                ))}
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {item.points.map((point) => (
                    <li key={point.label}>
                      <strong className="font-semibold">{point.label}:</strong> {point.text}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {!isOpen && <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />}
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="mx-auto mt-2 flex items-center gap-2 text-sm text-primary hover:underline"
        >
          {isOpen ? "Show less" : "Show more"}
          <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="text-xs" />
        </button>
      </div>
    </section>
  );
};

export default CarGuide;
