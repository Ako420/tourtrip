import Link from "next/link";
import type { InspirationItem, Section } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type InspirationProps = {
  section: Section<InspirationItem>;
};

const Inspiration = ({ section }: InspirationProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <Carousel label="destinations" slideClassName="w-40 lg:w-[calc((100%-4rem)/5)]">
        {section.items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative block h-28 overflow-hidden rounded-card bg-primary-deep text-white"
          >
            <AppImage
              src={item.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 14rem, 10rem"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            {item.tag && (
              <span className="absolute top-2 left-2 rounded-sm bg-ink/50 px-1.5 text-badge">{item.tag}</span>
            )}
            <span className="absolute bottom-2 left-3 text-lg font-bold">{item.name}</span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

export default Inspiration;
