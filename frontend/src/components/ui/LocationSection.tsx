import Link from "next/link";
import type { ReactNode } from "react";
import type { NearbyPlace } from "@/types";
import Icon from "./Icon";

type LocationSectionProps = {
  address: string;
  nearby: NearbyPlace[];
  children?: ReactNode;
  compact?: boolean;
};

const LocationSection = ({ address, nearby, children, compact = false }: LocationSectionProps) => {
  return (
    <section id="location" className={`scroll-mt-32 ${compact ? "rounded-card bg-surface p-5" : "mt-10"}`}>
      <h2 className={`mb-1 font-bold ${compact ? "text-xl" : "text-2xl"}`}>Location</h2>
      <p className="mb-4 flex items-center gap-1.5 text-sm">
        <Icon name="location" />
        {address}
      </p>
      <ul className={`grid gap-x-10 gap-y-3 text-sm ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {nearby.map((place) => (
          <li key={place.id} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-3">
              <Icon name={place.iconName} className="w-4" />
              {place.name}
            </span>
            <span className="shrink-0 text-ink-soft">{place.distance}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Link href="/map" className="text-sm font-medium underline hover:text-primary">
          Show on map
        </Link>
      </div>
      {children}
    </section>
  );
};

export default LocationSection;
