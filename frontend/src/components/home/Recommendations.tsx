"use client";

import Link from "next/link";
import { useState } from "react";
import type { RecommendationTab, Section } from "@/types";
import SectionHeading from "../ui/SectionHeading";

type RecommendationsProps = {
  section: Section<RecommendationTab>;
};

const Recommendations = ({ section }: RecommendationsProps) => {
  const [activeId, setActiveId] = useState(section.items[0]?.id);
  const activeTab = section.items.find((tab) => tab.id === activeId);

  return (
    <section className="mx-auto mt-12 max-w-content pb-8">
      <SectionHeading>{section.title}</SectionHeading>

      <div role="tablist" aria-label={section.title} className="scrollbar-none flex gap-2 overflow-x-auto md:flex-wrap">
        {section.items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => setActiveId(tab.id)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
              tab.id === activeId ? "bg-ink text-white" : "bg-surface-alt text-ink-soft hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul role="tabpanel" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-card p-4 shadow-card sm:grid-cols-3 lg:grid-cols-5">
        {activeTab?.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-ink-soft hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Recommendations;
