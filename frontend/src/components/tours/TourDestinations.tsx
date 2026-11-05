"use client";

import { useState } from "react";
import type { Tour, ToursContent } from "@/types";
import Carousel from "../ui/Carousel";
import PillTabs from "../ui/PillTabs";
import SectionHeading from "../ui/SectionHeading";
import TourCard from "./TourCard";

type TourDestinationsProps = {
  section: ToursContent["recommended"];
  tours: Tour[];
};

const TourDestinations = ({ section, tours }: TourDestinationsProps) => {
  const [activeId, setActiveId] = useState(section.tabs[0]?.id ?? "");
  const activeTab = section.tabs.find((tab) => tab.id === activeId);
  const visibleTours = tours.filter((tour) => activeTab?.cities.includes(tour.city));

  return (
    <section className="mx-auto max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <PillTabs options={section.tabs} activeId={activeId} onChange={setActiveId} />

      <div key={activeId} className="mt-5">
        <Carousel label="tours" slideClassName="w-64 lg:w-[calc((100%-3rem)/4)]">
          {visibleTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default TourDestinations;
