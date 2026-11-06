import Link from "next/link";
import { formatShortDate } from "@/lib";
import type { Guide } from "@/types";
import AppImage from "../ui/AppImage";

type GuideCardProps = {
  guide: Guide;
};

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <Link
      href={`/inspiration/${guide.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-surface-alt">
        <AppImage
          src={guide.coverUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 py-4">
        <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary">{guide.title}</h3>
        <p className="mt-auto pt-2 text-sm text-muted">
          {guide.city} · {formatShortDate(guide.publishedAt)}
        </p>
      </div>
    </Link>
  );
};

export default GuideCard;
