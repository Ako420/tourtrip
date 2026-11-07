import Link from "next/link";
import { toTrainRouteHref } from "@/lib";
import type { TrainsContent } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import Price from "../ui/Price";
import TrainSection from "./TrainSection";

type TrainRouteSectionProps = {
  section: TrainsContent["routeSections"][number];
};

const TrainRouteSection = ({ section }: TrainRouteSectionProps) => {
  return (
    <TrainSection id={section.id} title={section.title}>
      <Carousel label="routes" slideClassName="w-72 pb-2 sm:w-80 lg:w-[calc((100%-2rem)/3)]">
        {section.items.map((group) => (
          <article key={group.id} className="h-full overflow-hidden rounded-card border border-line">
            <div className="relative aspect-[2/1] bg-surface-alt">
              <AppImage src={group.imageUrl} alt="" fill sizes="(min-width: 1024px) 24rem, 20rem" className="object-cover" />
            </div>

            <div className="p-6">
              <h3 className="mb-3 text-2xl font-semibold">{group.title}</h3>
              <ul>
                {group.routes.map((route) => (
                  <li key={`${route.from}-${route.to}`}>
                    <Link
                      href={toTrainRouteHref(route.from, route.to)}
                      className="flex items-center justify-between gap-3 py-1.5 transition-colors duration-300 ease-out hover:text-primary"
                    >
                      <span className="min-w-0 truncate">{route.from} to {route.to}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span>From <Price amount={route.fromPrice} currency={route.currency} /></span>
                        <Icon name="chevron-right" className="text-xs" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </Carousel>
    </TrainSection>
  );
};

export default TrainRouteSection;
