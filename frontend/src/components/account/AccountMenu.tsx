"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { logoutAction } from "@/actions/auth";
import { authLinks } from "@/constants";
import { useDismiss } from "@/hooks";
import { getInitials } from "@/lib";
import type { AccountUser } from "@/types";
import Icon from "../ui/Icon";

type AccountMenuProps = {
  user: AccountUser;
  variant?: "primary" | "inverse";
};

const menuItemClass =
  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink transition-colors duration-200 hover:bg-surface-alt";

const AccountMenu = ({ user, variant = "primary" }: AccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstName] = user.fullName.trim().split(/\s+/);

  useDismiss(containerRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Account menu"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-2 text-sm font-medium ${variant === "inverse" ? "text-white" : "text-ink"}`}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {getInitials(user.fullName)}
        </span>
        <span className="hidden max-w-28 truncate sm:block">{firstName}</span>
        <Icon name="chevron-down" className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-card">
          <p className="truncate border-b border-line px-4 py-2 text-xs text-muted">{user.email}</p>
          <Link href={authLinks.account} onClick={() => setIsOpen(false)} className={menuItemClass}>
            <Icon name="user" className="w-4 text-ink-soft" />
            My account
          </Link>
          <Link href="/bookings" onClick={() => setIsOpen(false)} className={menuItemClass}>
            <Icon name="ticket" className="w-4 text-ink-soft" />
            Find bookings
          </Link>
          <Link href="/planner" onClick={() => setIsOpen(false)} className={menuItemClass}>
            <Icon name="route" className="w-4 text-ink-soft" />
            Trip planner
          </Link>
          <form action={logoutAction} className="border-t border-line">
            <button type="submit" className={menuItemClass}>
              <Icon name="signOut" className="w-4 text-ink-soft" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
