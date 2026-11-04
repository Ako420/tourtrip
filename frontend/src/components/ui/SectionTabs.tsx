"use client";

import { useEffect, useState } from "react";

type SectionTabsProps = {
  sections: { id: string; label: string }[];
};

const SectionTabs = ({ sections }: SectionTabsProps) => {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Page sections" className="sticky top-navbar z-20 mt-5 border-b border-line bg-surface">
      <ul className="scrollbar-none flex gap-6 overflow-x-auto">
        {sections.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={activeId === id ? "true" : undefined}
              className={`block border-b-2 py-3 text-sm font-medium transition-colors duration-300 ease-out ${
                activeId === id ? "border-primary text-primary" : "border-transparent hover:text-primary"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SectionTabs;
