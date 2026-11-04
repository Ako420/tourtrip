"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { IconName } from "@/constants";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type PickerPopoverProps = {
  iconName: IconName;
  summary: string;
  children: ReactNode;
};

const PickerPopover = ({ iconName, summary, children }: PickerPopoverProps) => {
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
    <div ref={containerRef} className="relative flex h-full flex-1 items-center">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center gap-3 text-left font-semibold"
      >
        <Icon name={iconName} className="text-lg text-ink-soft" />
        <span>{summary}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-10 mt-2 rounded-card border border-line bg-surface p-4 shadow-card xl:left-auto xl:w-72">
          {children}
          <Button size="sm" className="mt-2 w-full" onClick={() => setIsOpen(false)} type="button">
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default PickerPopover;
