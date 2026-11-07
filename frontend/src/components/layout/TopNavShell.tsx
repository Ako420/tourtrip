import Link from "next/link";
import type { ReactNode } from "react";
import { navbarLinks, sidebarGroups, TOP_NAV_VISIBLE_LINKS } from "@/constants";
import type { NavItem } from "@/types";
import Icon from "../ui/Icon";
import CurrencyMenu from "./CurrencyMenu";
import FloatingActions from "./FloatingActions";
import Footer from "./Footer";
import NavMoreMenu from "./NavMoreMenu";
import SignInButton from "./SignInButton";

type TopNavShellProps = {
  activeHref: string;
  account?: ReactNode;
  children: ReactNode;
};

const mainLinks = sidebarGroups.slice(0, 3).flatMap((group) => group.items);
const appLink = sidebarGroups.flatMap((group) => group.items).find((link) => link.href === "/app");

// The current page always stays visible, even when it would normally sit in the More menu.
const getVisibleLinks = (activeHref: string) => {
  const links = mainLinks.slice(0, TOP_NAV_VISIBLE_LINKS);
  const active = mainLinks.find((link) => link.href === activeHref);

  return active && !links.includes(active) ? [...links, active] : links;
};

// Used by pages with a full-width hero. The menu sits on top of the hero, so it has no background.
const TopNavShell = ({ activeHref, account, children }: TopNavShellProps) => {
  const visibleLinks = getVisibleLinks(activeHref);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="flex h-navbar items-center gap-8 px-4 xl:px-8">
          <Link href="/" className="text-logo font-extrabold tracking-tight">
            Hotel<span className="text-accent">.</span>Jr
          </Link>

          <nav aria-label="Main" className="hidden min-w-0 items-center gap-8 xl:flex">
            <NavLinks links={visibleLinks} activeHref={activeHref} className="gap-8 text-base" />
            <NavMoreMenu links={mainLinks.filter((link) => !visibleLinks.includes(link))} />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-5 text-sm font-medium">
            {appLink && <HeaderLink link={appLink} />}
            <CurrencyMenu />
            {navbarLinks.map((link) => (
              <HeaderLink key={link.href} link={link} />
            ))}
            {account ?? <SignInButton variant="inverse" />}
          </div>
        </div>

        <nav aria-label="Main" className="px-4 xl:hidden">
          <NavLinks links={mainLinks} activeHref={activeHref} className="gap-5 text-sm" />
        </nav>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
};

const HeaderLink = ({ link }: { link: NavItem }) => {
  return (
    <Link
      href={link.href}
      className="hidden items-center gap-1.5 whitespace-nowrap transition-opacity duration-300 ease-out hover:opacity-80 min-[1400px]:flex"
    >
      {link.iconName && <Icon name={link.iconName} />}
      {link.label}
    </Link>
  );
};

type NavLinksProps = {
  links: NavItem[];
  activeHref: string;
  className: string;
};

const NavLinks = ({ links, activeHref, className }: NavLinksProps) => {
  return (
    <ul className={`scrollbar-none flex overflow-x-auto ${className}`}>
      {links.map((link) => (
        <li key={link.href} className="shrink-0">
          <Link
            href={link.href}
            aria-current={link.href === activeHref ? "page" : undefined}
            className={`block border-b-2 py-2 whitespace-nowrap transition-colors duration-300 ease-out ${
              link.href === activeHref ? "border-white font-medium" : "border-transparent hover:border-white/60"
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
