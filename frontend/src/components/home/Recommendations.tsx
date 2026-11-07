"use client";

import Link from "next/link";
import { useState } from "react";
import type { RecommendationTab, Section } from "@/types";
import SectionHeading from "../ui/SectionHeading";

type RecommendationsProps = {
  section: Section<RecommendationTab>;
  variant?: "pills" | "underline";
};

const tabClass = {
  pills: {
    list: "gap-2 md:flex-wrap",
    tab: "rounded-md px-3 py-2 text-sm font-medium",
    active: "bg-ink text-white",
    idle: "bg-line/50 text-ink-soft hover:text-primary",
  },
  underline: {
    list: "gap-6 border-b border-line",
    tab: "border-b-2 pb-3 font-medium",
    active: "border-ink text-ink",
    idle: "border-transparent text-ink-soft hover:text-primary",
  },
};

const Recommendations = ({ section, variant = "pills" }: RecommendationsProps) => {
  const [activeId, setActiveId] = useState(section.items[0]?.id);
  const activeTab = section.items.find((tab) => tab.id === activeId);
  const styles = tabClass[variant];

  return (
    <section className="mx-auto mt-12 max-w-content pb-8">
      <SectionHeading>{section.title}</SectionHeading>

      <div role="tablist" aria-label={section.title} className={`scrollbar-none flex overflow-x-auto ${styles.list}`}>
        {section.items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => setActiveId(tab.id)}
            className={`shrink-0 transition-colors duration-300 ease-out ${styles.tab} ${
              tab.id === activeId ? styles.active : styles.idle
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul role="tabpanel" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-card bg-surface p-4 shadow-card sm:grid-cols-3 lg:grid-cols-5">
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
