import Link from "next/link";
import type { ReactNode } from "react";
import type { NearbyPlace } from "@/types";
import Icon from "./Icon";

type LocationSectionProps = {
  address: string;
  nearby: NearbyPlace[];
  children?: ReactNode;
};

const LocationSection = ({ address, nearby, children }: LocationSectionProps) => {
  return (
    <section id="location" className="mt-10 scroll-mt-32">
      <h2 className="mb-1 text-2xl font-bold">Location</h2>
      <p className="mb-4 flex items-center gap-1.5 text-sm">
        <Icon name="location" />
        {address}
      </p>
      <ul className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
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
