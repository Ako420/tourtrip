"use client";

import { useEffect, useRef, useState } from "react";
import { BASE_CURRENCY, currencies } from "@/constants";
import { useCurrency } from "@/hooks";
import Icon from "../ui/Icon";

const CurrencyMenu = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`Currency: ${currency}`}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-1.5 text-sm font-medium transition-opacity duration-300 ease-out hover:opacity-80"
      >
        <Icon name="globe" />
        {currency}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-card border border-line bg-surface text-ink shadow-card sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-64">
          <ul className="max-h-72 overflow-y-auto py-1">
            {currencies.map(({ code, name }) => (
              <li key={code}>
                <button
                  type="button"
                  aria-pressed={code === currency}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-surface-alt ${
                    code === currency ? "font-semibold text-primary" : ""
                  }`}
                >
                  <span className="w-9">{code}</span>
                  <span className="text-ink-soft">{name}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-2 text-xs text-muted">
            Prices are converted at sample rates. You always book in {BASE_CURRENCY}.
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyMenu;
