import Link from "next/link";
import { formatShortDate, getGuideExcerpt } from "@/lib";
import type { Guide } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";

type GuideFeaturedProps = {
  guides: Guide[];
};

const GuideFeatured = ({ guides }: GuideFeaturedProps) => {
  return (
    <section className="mt-8">
      <h2 className="mb-5 text-2xl font-semibold">Featured posts</h2>

      <Carousel label="featured posts" slideClassName="w-full">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/inspiration/${guide.slug}`}
            className="group grid overflow-hidden rounded-panel border border-line md:h-80 md:grid-cols-[53%_1fr]"
          >
            <div className="relative h-52 overflow-hidden bg-surface-alt md:h-auto">
              <AppImage
                src={guide.coverUrl}
                alt=""
                fill
                sizes="(min-width: 768px) 38rem, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center p-6 md:px-14">
              <h3 className="line-clamp-2 text-2xl group-hover:text-primary md:text-3xl">{guide.title}</h3>
              <p className="mt-3 line-clamp-3 text-lg text-ink-soft">{getGuideExcerpt(guide.body)}</p>
              <p className="mt-3 text-sm text-muted">{formatShortDate(guide.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

export default GuideFeatured;
