"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useDismiss } from "@/hooks";
import type { NavItem } from "@/types";
import Icon from "../ui/Icon";

type NavMoreMenuProps = {
  links: NavItem[];
};

const NavMoreMenu = ({ links }: NavMoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useDismiss(containerRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="More"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 items-center px-1 text-xl transition-opacity duration-300 ease-out hover:opacity-80"
      >
        <Icon name="more" />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 z-50 mt-2 w-56 overflow-hidden rounded-card border border-line bg-surface py-1 text-ink shadow-card">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm transition-colors duration-200 hover:bg-surface-alt"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavMoreMenu;
