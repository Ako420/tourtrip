"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authLinks } from "@/constants";
import Icon from "../ui/Icon";

const SCROLL_TOP_OFFSET = 400;

const buttonClass = "flex size-12 items-center lg:size-15 justify-center rounded-full bg-surface text-lg shadow-float transition-colors duration-300 ease-out hover:text-primary";

const FloatingActions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > SCROLL_TOP_OFFSET);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-6 z-20 flex flex-col items-center gap-2 lg:right-2 lg:bottom-20">
      {showBackToTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={buttonClass}
        >
          <Icon name="chevron-up" />
        </button>
      )}
      <Link
        href={authLinks.assistant}
        aria-label="Travel assistant"
        className="flex size-14 flex-col items-center lg:size-15 justify-center rounded-full border-2 border-primary-soft bg-primary-deep text-white shadow-float transition-colors duration-300 ease-out hover:bg-primary-dark motion-safe:animate-breathing"
      >
        <Icon name="robot" className="text-lg" />
        <span className="text-micro font-semibold">ASK</span>
      </Link>
      <Link href={authLinks.support} aria-label="Customer support" className={buttonClass}>
        <Icon name="headset" />
      </Link>
    </div>
  );
};

export default FloatingActions;
