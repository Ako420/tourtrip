import Link from "next/link";
import type { TrainsContent } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import TrainSection from "./TrainSection";

type TrainRegionProps = {
  region: TrainsContent["regions"][number];
};

const TrainRegion = ({ region }: TrainRegionProps) => {
  return (
    <TrainSection id={region.id} title={region.title}>
      <ul className="grid gap-6 lg:grid-cols-2">
        {region.items.map((card) => (
          <li key={card.id} className="grid overflow-hidden rounded-card bg-surface shadow-card sm:grid-cols-[11.25rem_1fr]">
            <div className="relative h-44 bg-surface-alt sm:h-auto">
              <AppImage src={card.imageUrl} alt="" fill sizes="(min-width: 640px) 11.25rem, 100vw" className="object-cover" />
            </div>

            <div className="flex min-w-0 flex-col p-6">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <ul className="mt-3">
                {card.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between gap-3 py-1 transition-colors duration-300 ease-out hover:text-primary"
                    >
                      {link.label}
                      <Icon name="chevron-right" className="text-xs" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-1 pt-6">
                {card.searches.map((search) => (
                  <Link key={search.href} href={search.href} className="flex items-center gap-2 text-lg font-medium text-primary hover:underline">
                    {search.label}
                    <Icon name="arrow-right" className="text-sm" />
                  </Link>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </TrainSection>
  );
};

export default TrainRegion;
