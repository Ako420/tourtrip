import Link from "next/link";
import type { HotelSummary } from "@/types";
import Icon from "../ui/Icon";

type HotelBreadcrumbProps = {
  hotel: HotelSummary;
};

const HotelBreadcrumb = ({ hotel }: HotelBreadcrumbProps) => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Hotels", href: "/hotels" },
    { label: hotel.city, href: `/hotels?destination=${encodeURIComponent(hotel.city)}` },
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href} className="flex items-center gap-2">
            <Link href={link.href} className="transition-colors duration-300 ease-out hover:text-primary">
              {link.label}
            </Link>
            <Icon name="chevron-right" className="text-[0.625rem]" />
          </li>
        ))}
        <li aria-current="page" className="text-ink">
          {hotel.name}
        </li>
      </ol>
    </nav>
  );
};

export default HotelBreadcrumb;
