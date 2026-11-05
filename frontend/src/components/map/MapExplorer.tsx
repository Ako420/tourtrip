"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mapPlaceFilters } from "@/constants";
import { formatCount } from "@/lib";
import type { MapPlace, MapPlaceType } from "@/types";
import Icon from "../ui/Icon";
import PillTabs from "../ui/PillTabs";
import PlaceMap from "./PlaceMap";
import Price from "../ui/Price";

type MapExplorerProps = {
  places: MapPlace[];
};

const MapExplorer = ({ places }: MapExplorerProps) => {
  const [filter, setFilter] = useState<MapPlaceType | "all">("all");
  const [activeId, setActiveId] = useState<string>();
  const visiblePlaces = useMemo(() => {
    return places.filter((place) => filter === "all" || place.type === filter);
  }, [places, filter]);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="sticky top-navbar z-0 order-1 h-72 overflow-hidden rounded-card border border-line bg-surface-alt lg:order-2 lg:top-24 lg:h-[calc(100dvh-8rem)]">
        <PlaceMap places={visiblePlaces} activeId={activeId} onSelect={setActiveId} />
      </div>

      <section aria-label="Places on the map" className="order-2 min-w-0 lg:order-1">
        <PillTabs options={mapPlaceFilters} activeId={filter} onChange={setFilter} />
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {formatCount(visiblePlaces.length, "place")}
        </p>

        <ul className="mt-2 flex flex-col gap-2 lg:max-h-[calc(100dvh-14rem)] lg:overflow-y-auto">
          {visiblePlaces.map((place) => (
            <li
              key={place.id}
              className={`flex items-center gap-3 rounded-card border p-3 transition-colors duration-300 ease-out ${
                place.id === activeId ? "border-primary bg-primary-soft" : "border-line"
              }`}
            >
              <button
                type="button"
                aria-label={`Show ${place.name} on the map`}
                onClick={() => setActiveId(place.id)}
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white ${
                  place.type === "hotel" ? "bg-primary" : "bg-accent"
                }`}
              >
                <Icon name={place.type === "hotel" ? "bed" : "ticket"} className="text-sm" />
              </button>
              <div className="min-w-0 flex-1">
                <Link href={place.href} className="block truncate text-sm font-semibold hover:text-primary">
                  {place.name}
                </Link>
                <p className="truncate text-xs text-muted">
                  {place.city} · From <Price amount={place.price} currency={place.currency} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MapExplorer;
