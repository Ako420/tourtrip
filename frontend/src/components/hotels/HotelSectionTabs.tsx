"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "policies", label: "Policies" },
  { id: "location", label: "Location" },
];

const HotelSectionTabs = () => {
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
  }, []);

  return (
    <nav aria-label="Hotel sections" className="sticky top-navbar z-20 mt-5 border-b border-line bg-surface">
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

export default HotelSectionTabs;
