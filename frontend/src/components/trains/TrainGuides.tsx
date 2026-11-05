"use client";

import Link from "next/link";
import { useState } from "react";
import { formatShortDate } from "@/lib";
import type { Guide, TrainsContent } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import PillTabs from "../ui/PillTabs";
import TrainSection from "./TrainSection";

type TrainGuidesProps = {
  section: TrainsContent["guides"];
  guides: Guide[];
};

const TrainGuides = ({ section, guides }: TrainGuidesProps) => {
  const [activeId, setActiveId] = useState(section.tabs[0]?.id ?? "");
  const activeTab = section.tabs.find((tab) => tab.id === activeId);
  const visibleGuides = guides.filter((guide) => activeTab?.cities.includes(guide.city));

  return (
    <TrainSection id="guides" title={section.title}>
      <PillTabs options={section.tabs.map(({ id, label }) => ({ id, label }))} activeId={activeId} onChange={setActiveId} />

      <div key={activeId} className="mt-5">
        <Carousel label="guides" slideClassName="w-72 pb-2 sm:w-80 lg:w-[calc((100%-2rem)/3)]">
          {visibleGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/inspiration/${guide.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-line"
            >
              <div className="relative aspect-[2/1] overflow-hidden bg-surface-alt">
                <AppImage
                  src={guide.coverUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 24rem, 20rem"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-ink-soft">Updated: {formatShortDate(guide.publishedAt)}</p>
                <h3 className="mt-3 text-xl font-semibold group-hover:text-primary">{guide.title}</h3>
                <Icon name="chevron-right" className="mt-auto self-end pt-4 text-sm" />
              </div>
            </Link>
          ))}
        </Carousel>
      </div>

      <div className="mt-5 flex justify-end">
        <Link href={section.moreHref} className="text-xl text-primary hover:underline">
          {section.moreLabel}
        </Link>
      </div>
    </TrainSection>
  );
};

export default TrainGuides;
