import type { InspirationItem, Section } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type DestinationTabsProps = {
  section: Section<InspirationItem>;
  activeId: string;
  onChange: (id: string) => void;
};

const DestinationTabs = ({ section, activeId, onChange }: DestinationTabsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <Carousel label="destinations" slideClassName="w-40 pb-3 lg:w-[calc((100%-4rem)/5)]">
        {section.items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(item.id)}
              className={`group relative block h-28 w-full rounded-card text-left text-white ${
                isActive ? "ring-2 ring-primary" : ""
              }`}
            >
              <span className="absolute inset-0 overflow-hidden rounded-card bg-primary-deep">
                <AppImage
                  src={item.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 14rem, 10rem"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              </span>
              <span className="absolute bottom-2 left-3 text-lg font-bold">{item.name}</span>
              {isActive && (
                <span aria-hidden className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 bg-primary" />
              )}
            </button>
          );
        })}
      </Carousel>
    </section>
  );
};

export default DestinationTabs;
