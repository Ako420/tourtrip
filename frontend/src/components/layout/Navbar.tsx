import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";
import { navbarLeadLinks, navbarLinks } from "@/constants";
import type { NavItem } from "@/types";
import Icon from "../ui/Icon";
import CurrencyMenu from "./CurrencyMenu";
import Logo from "./Logo";
import SignInButton from "./SignInButton";

type NavbarProps = {
  onMenuClick?: () => void;
  account?: ReactNode;
};

const NavbarLinks = ({ links }: { links: NavItem[] }) => {
  return (
    <ul className="hidden items-center gap-5 xl:flex">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ease-out hover:text-primary">
            {link.iconName && <Icon name={link.iconName} className="text-ink-soft" />}
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = ({ onMenuClick, account }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-navbar items-center gap-4 border-b border-line bg-surface px-4 lg:px-5">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          className="flex size-9 items-center justify-center rounded-md text-lg text-muted hover:bg-surface-alt"
        >
          <Icon name="menu" />
        </button>
      )}

      <Logo />

      <Form action="/hotels/list" role="search" className="ml-3 hidden h-9 w-75 md:flex">
        <input
          name="destination"
          placeholder="Destination or hotel"
          aria-label="Search destination or hotel"
          className="min-w-0 flex-1 rounded-l-md border border-r-0 border-line px-3 text-sm outline-none placeholder:text-muted focus:border-primary"
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-10 rounded-r-md bg-primary text-white hover:bg-primary-dark"
        >
          <Icon name="search" />
        </button>
      </Form>

      <nav aria-label="Account" className="ml-auto flex items-center gap-5">
        <NavbarLinks links={navbarLeadLinks} />
        <CurrencyMenu />
        <NavbarLinks links={navbarLinks} />
        {account ?? <SignInButton />}
      </nav>
    </header>
  );
};

export default Navbar;
