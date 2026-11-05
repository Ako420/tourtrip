"use client";

import "leaflet/dist/leaflet.css";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAP_ATTRIBUTION, MAP_MAX_ZOOM, MAP_PLACE_ZOOM, MAP_TILE_URL } from "@/constants";
import { formatPrice } from "@/lib";
import type { MapPlace } from "@/types";

type Leaflet = typeof import("leaflet");

type PlaceMapProps = {
  places: MapPlace[];
  activeId?: string;
  onSelect: (id: string) => void;
};

// Popups are plain elements, because Leaflet draws them outside of React.
const buildPopup = (place: MapPlace, onOpen: (href: string) => void) => {
  const popup = document.createElement("div");
  const name = document.createElement("p");
  const details = document.createElement("p");
  const link = document.createElement("a");

  name.className = "font-semibold";
  name.textContent = place.name;
  details.className = "text-xs text-muted";
  details.textContent = `${place.city} · From ${formatPrice(place.price, place.currency)}`;
  link.className = "mt-1 inline-block font-medium text-primary hover:underline";
  link.href = place.href;
  link.textContent = "View details";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    onOpen(place.href);
  });

  popup.append(name, details, link);

  return popup;
};

const PlaceMap = ({ places, activeId, onSelect }: PlaceMapProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ L: Leaflet; map: LeafletMap; pins: LayerGroup } | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const [isReady, setIsReady] = useState(false);

  // Leaflet needs the browser's window, so it loads after the page does.
  useEffect(() => {
    let isCancelled = false;

    import("leaflet").then((L) => {
      if (isCancelled || !containerRef.current) return;

      const map = L.map(containerRef.current).setView([20, 10], 2);

      L.tileLayer(MAP_TILE_URL, { attribution: MAP_ATTRIBUTION, maxZoom: MAP_MAX_ZOOM }).addTo(map);
      leafletRef.current = { L, map, pins: L.layerGroup().addTo(map) };
      setIsReady(true);
    });

    return () => {
      isCancelled = true;
      leafletRef.current?.map.remove();
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const leaflet = leafletRef.current;

    if (!isReady || !leaflet) return;

    const { L, map, pins } = leaflet;

    pins.clearLayers();
    markersRef.current.clear();

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], {
        title: place.name,
        alt: place.name,
        icon: L.divIcon({ className: `map-pin map-pin-${place.type}`, iconSize: [16, 16] }),
      });

      marker.bindPopup(buildPopup(place, (href) => router.push(href)));
      marker.on("click", () => onSelect(place.id));
      marker.addTo(pins);
      markersRef.current.set(place.id, marker);
    });

    if (places.length > 0) {
      map.fitBounds(L.latLngBounds(places.map((place) => [place.latitude, place.longitude])), { padding: [32, 32] });
    }
  }, [isReady, places, onSelect, router]);

  useEffect(() => {
    const marker = activeId ? markersRef.current.get(activeId) : undefined;

    if (!marker || !leafletRef.current) return;

    leafletRef.current.map.flyTo(marker.getLatLng(), MAP_PLACE_ZOOM, { duration: 0.8 });
    marker.openPopup();
  }, [activeId, isReady]);

  return <div ref={containerRef} role="region" aria-label="Map of hotels and attractions" className="size-full" />;
};

export default PlaceMap;
