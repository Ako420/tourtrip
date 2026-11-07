"use client";

import { useState } from "react";
import type { HomeContent, HomeDestination, HotelSummary } from "@/types";
import DestinationTabs from "./DestinationTabs";
import HandpickedHotels from "./HandpickedHotels";
import Moments from "./Moments";
import Places from "./Places";
import RouteCarousel from "./RouteCarousel";

type HomeExplorerProps = {
  content: Pick<HomeContent, "inspiration" | "places" | "moments" | "handpickedHotels">;
  hotels: HotelSummary[];
  destinations: HomeDestination[];
};

const ANYWHERE_ID = "anywhere";

// Choosing a destination swaps the sections below it for that place.
const HomeExplorer = ({ content, hotels, destinations }: HomeExplorerProps) => {
  const [activeId, setActiveId] = useState(ANYWHERE_ID);
  const destination = destinations.find((item) => item.id === activeId);
  const query = encodeURIComponent(destination?.name ?? "");

  return (
    <>
      <DestinationTabs section={content.inspiration} activeId={activeId} onChange={setActiveId} />

      {destination ? (
        <>
          {destination.sights.length > 0 && (
            <Places
              section={{
                title: `Must-see sights in ${destination.name}`,
                moreHref: `/attractions?q=${query}#results`,
                items: destination.sights,
              }}
            />
          )}
          {destination.moments.length > 0 && (
            <Moments
              section={{
                title: `Travel stories from ${destination.name}`,
                moreHref: `/inspiration?city=${query}`,
                items: destination.moments,
              }}
            />
          )}
          {destination.hotels.length > 0 && (
            <HandpickedHotels
              title={`Where to stay in ${destination.name}`}
              moreHref={`/hotels/list?destination=${query}`}
              hotels={destination.hotels}
            />
          )}
          {destination.routes.length > 0 && (
            <RouteCarousel title={`Getting to and from ${destination.name}`} routes={destination.routes} />
          )}
        </>
      ) : (
        <>
          <Places section={content.places} />
          <Moments section={content.moments} />
          <HandpickedHotels
            title={content.handpickedHotels.title}
            moreHref={content.handpickedHotels.moreHref}
            hotels={hotels}
          />
        </>
      )}
    </>
  );
};

export default HomeExplorer;
