import type { IconName } from "@/constants";

export type NavItem = {
  label: string;
  href: string;
  iconName?: IconName;
  badge?: string;
};

export type NavGroup = {
  id: string;
  items: NavItem[];
};

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

export type RouteParams = Record<string, string | string[] | undefined>;
