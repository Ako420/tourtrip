import type { FooterColumn, NavGroup, NavItem } from "@/types";
import type { IconName } from "./icons";

export const sidebarGroups: NavGroup[] = [
  {
    id: "book",
    items: [
      { label: "Hotels & Homes", href: "/hotels", iconName: "bed" },
      { label: "Flights", href: "/flights", iconName: "plane" },
      { label: "Trains", href: "/trains", iconName: "train" },
      { label: "Cars", href: "/cars", iconName: "car" },
      { label: "Attractions & Tours", href: "/attractions", iconName: "ticket" },
      { label: "Flight + Hotel", href: "/packages", iconName: "building" },
    ],
  },
  {
    id: "tours",
    items: [
      { label: "Private Tours", href: "/private-tours", iconName: "compass" },
      { label: "Group Tours", href: "/group-tours", iconName: "users" },
      { label: "Cruises", href: "/cruises", iconName: "ship" },
    ],
  },
  {
    id: "explore",
    items: [
      { label: "Trip Planner", href: "/planner", iconName: "route", badge: "New" },
      { label: "Travel Inspiration", href: "/inspiration", iconName: "send" },
      { label: "Map", href: "/map", iconName: "map" },
      { label: "Deals", href: "/deals", iconName: "tag" },
    ],
  },
  {
    id: "account",
    items: [
      { label: "Rewards", href: "/rewards", iconName: "gift" },
      { label: "App", href: "/app", iconName: "phone" },
    ],
  },
];

export const navbarLinks: NavItem[] = [
  { label: "App", href: "/app", iconName: "phone" },
  { label: "List your property", href: "/list-property" },
  { label: "USD", href: "/currency", iconName: "globe" },
  { label: "Customer support", href: "/support" },
  { label: "Find bookings", href: "/bookings" },
];

export const serviceTabs: NavItem[] = [
  { label: "Hotels & Homes", href: "/", iconName: "bed" },
  { label: "Flights", href: "/flights", iconName: "plane" },
  { label: "Trains", href: "/trains", iconName: "train" },
  { label: "Cars", href: "/cars", iconName: "car" },
  { label: "Attractions & Tours", href: "/attractions", iconName: "ticket" },
  { label: "Flight + Hotel", href: "/packages", iconName: "building" },
];

export const authLinks = {
  login: "/login",
  account: "/account",
  signup: "/signup",
  support: "/support",
  assistant: "/assistant",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Contact us",
    links: [
      { label: "Customer support", href: "/support" },
      { label: "Service guarantee", href: "/guarantee" },
      { label: "More service info", href: "/service-info" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Hotel Jr", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Careers", href: "/careers" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Statement", href: "/privacy" },
      { label: "Accessibility Statement", href: "/accessibility" },
    ],
  },
  {
    title: "Other services",
    links: [
      { label: "Rewards", href: "/rewards" },
      { label: "Affiliate program", href: "/affiliates" },
      { label: "List your property", href: "/list-property" },
      { label: "All hotels", href: "/hotels" },
      { label: "Become a supplier", href: "/suppliers" },
      { label: "Security", href: "/security" },
    ],
  },
];

export const socialLinks: NavItem[] = [
  { label: "Facebook", href: "/social/facebook", iconName: "facebook" },
  { label: "X", href: "/social/x", iconName: "x" },
  { label: "YouTube", href: "/social/youtube", iconName: "youtube" },
];

export const paymentMethods: { label: string; iconName: IconName }[] = [
  { label: "Visa", iconName: "visa" },
  { label: "Mastercard", iconName: "mastercard" },
  { label: "American Express", iconName: "amex" },
  { label: "Discover", iconName: "discover" },
  { label: "JCB", iconName: "jcb" },
  { label: "PayPal", iconName: "paypal" },
  { label: "Apple Pay", iconName: "apple-pay" },
];

export const copyrightText = "Copyright © 2026 Hotel Jr. All rights reserved.";
