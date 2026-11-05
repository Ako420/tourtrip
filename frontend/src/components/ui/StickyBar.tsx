"use client";

import { useEffect, useState, type ReactNode } from "react";

type StickyBarProps = {
  children: ReactNode;
  dense?: boolean;
};

const SHOW_AFTER_SCROLL = 320;

// The hero search scrolls away, so a copy stays pinned to the top of the page.
const StickyBar = ({ children, dense = false }: StickyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > SHOW_AFTER_SCROLL);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-x-0 top-0 z-40 hidden bg-surface px-4 text-ink shadow-card xl:block ${dense ? "py-4" : "py-6"}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </div>
  );
};

export default StickyBar;
