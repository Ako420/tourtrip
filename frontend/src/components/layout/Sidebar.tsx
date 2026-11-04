"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { sidebarGroups } from "@/constants";
import Icon from "../ui/Icon";

type SidebarProps = {
  isToggled: boolean;
  onNavigate: () => void;
};

type SidebarNavProps = SidebarProps & {
  pathname?: string;
};

const SidebarNav = ({ isToggled, onNavigate, pathname }: SidebarNavProps) => {
  return (
    <nav aria-label="Main">
      {sidebarGroups.map((group) => (
        <ul key={group.id} className="mx-3 border-b border-line py-2 last:border-b-0">
          {group.items.map((item) => {
            const isActive = pathname?.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  title={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-11 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors duration-300 ease-out hover:bg-surface-alt ${
                    isActive ? "text-primary" : "text-ink"
                  }`}
                >
                  {item.iconName && (
                    <span className={`w-5 shrink-0 text-center ${isActive ? "text-primary" : "text-ink-soft"}`}>
                      <Icon name={item.iconName} />
                    </span>
                  )}
                  <span className={`truncate ${isToggled ? "lg:hidden" : ""}`}>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-sm bg-promo px-1 text-[0.625rem] leading-4 text-white ${
                        isToggled ? "lg:hidden" : ""
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ))}
    </nav>
  );
};

const ActiveSidebarNav = (props: SidebarProps) => {
  return <SidebarNav {...props} pathname={usePathname()} />;
};

const Sidebar = ({ isToggled, onNavigate }: SidebarProps) => {
  return (
    <aside
      className={`fixed top-navbar bottom-0 left-0 z-30 w-sidebar overflow-y-auto border-r border-line bg-surface py-3 transition-[width,translate] duration-200 ease-in-out lg:sticky lg:h-[calc(100dvh-var(--spacing-navbar))] lg:shrink-0 lg:translate-x-0 ${
        isToggled ? "translate-x-0 lg:w-16" : "-translate-x-full"
      }`}
    >
      {/* The current path is only known at request time, so the links render first without a highlight. */}
      <Suspense fallback={<SidebarNav isToggled={isToggled} onNavigate={onNavigate} />}>
        <ActiveSidebarNav isToggled={isToggled} onNavigate={onNavigate} />
      </Suspense>
    </aside>
  );
};

export default Sidebar;
