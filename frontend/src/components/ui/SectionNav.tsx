"use client";

import { useEffect, useState } from "react";
import type { LinkItem } from "@/types";

type SectionNavProps = {
  label: string;
  links: LinkItem[];
  align?: "center" | "start";
};

const ACTIVE_OFFSET = 220;

const SectionNav = ({ label, links, align = "center" }: SectionNavProps) => {
  const [activeHref, setActiveHref] = useState<string>();

  useEffect(() => {
    const handleScroll = () => {
      const passed = links.filter(({ href }) => {
        const top = document.querySelector(href)?.getBoundingClientRect().top;

        return top !== undefined && top <= ACTIVE_OFFSET;
      });

      setActiveHref(passed.at(-1)?.href);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  return (
    <nav aria-label={label} className={`flex gap-8 ${align === "center" ? "justify-center" : ""}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          aria-current={link.href === activeHref ? "true" : undefined}
          className={`border-b-2 transition-colors duration-300 ease-out hover:text-primary ${
            link.href === activeHref ? "border-primary font-semibold text-primary" : "border-transparent"
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default SectionNav;
