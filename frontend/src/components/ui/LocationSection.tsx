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
      <h2 className="mb-1 text-xl font-bold">Location</h2>
      <p className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Icon name="location" />
        {address}
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {nearby.map((place) => (
          <li key={place.id} className="flex items-center gap-3 rounded-card border border-line p-3">
            <Icon name={place.iconName} className="text-primary" />
            <div>
              <p className="text-sm font-medium">{place.name}</p>
              <p className="text-xs text-muted">{place.distance}</p>
            </div>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
};

export default LocationSection;
