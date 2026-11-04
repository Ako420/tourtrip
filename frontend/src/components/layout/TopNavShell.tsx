import Link from "next/link";
import type { ReactNode } from "react";
import { authLinks, navbarLinks, sidebarGroups } from "@/constants";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import FloatingActions from "./FloatingActions";
import Footer from "./Footer";

type TopNavShellProps = {
  activeHref: string;
  children: ReactNode;
};

const mainLinks = sidebarGroups.slice(0, 3).flatMap((group) => group.items);

// Used by pages with a full-width hero. The menu sits on top of the hero, so it has no background.
const TopNavShell = ({ activeHref, children }: TopNavShellProps) => {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="flex h-14 items-center gap-6 px-4 xl:px-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            Hotel<span className="text-accent">.</span>Jr
          </Link>

          <nav aria-label="Main" className="hidden min-w-0 xl:block">
            <NavLinks activeHref={activeHref} />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-5 text-sm">
            <ul className="hidden items-center gap-5 min-[1800px]:flex">
              {navbarLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1.5 whitespace-nowrap transition-opacity duration-300 ease-out hover:opacity-80">
                    {link.iconName && <Icon name={link.iconName} />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href={authLinks.login} variant="inverse" size="sm">
              Sign in/register
            </ButtonLink>
          </div>
        </div>

        <nav aria-label="Main" className="px-4 xl:hidden">
          <NavLinks activeHref={activeHref} />
        </nav>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
};

const NavLinks = ({ activeHref }: { activeHref: string }) => {
  return (
    <ul className="scrollbar-none flex gap-5 overflow-x-auto text-sm">
      {mainLinks.map((link) => (
        <li key={link.href} className="shrink-0">
          <Link
            href={link.href}
            aria-current={link.href === activeHref ? "page" : undefined}
            className={`block border-b-2 py-2 whitespace-nowrap transition-colors duration-300 ease-out ${
              link.href === activeHref ? "border-white font-semibold" : "border-transparent hover:border-white/60"
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TopNavShell;
