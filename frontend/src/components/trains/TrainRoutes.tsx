import Link from "next/link";
import type { Section, TrainRoute } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import Price from "../ui/Price";

type TrainRoutesProps = {
  section: Section<TrainRoute>;
};

const TrainRoutes = ({ section }: TrainRoutesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((route) => (
          <li key={route.id}>
            <Link
              href={`/trains?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}#search`}
              className="group flex items-center gap-3 overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
            >
              <div className="relative size-24 shrink-0 overflow-hidden bg-surface-alt">
                <AppImage
                  src={route.imageUrl}
                  alt=""
                  fill
                  sizes="6rem"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 pr-3">
                <h3 className="flex flex-wrap items-center gap-x-2 font-semibold transition-colors duration-300 ease-out group-hover:text-primary">
                  {route.from}
                  <Icon name="swap" className="text-xs" />
                  {route.to}
                </h3>
                <p className="text-sm text-muted">{route.duration}</p>
                <p className="text-sm">From <Price amount={route.fromPrice} currency={route.currency} /></p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrainRoutes;
