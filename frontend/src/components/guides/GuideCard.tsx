import Link from "next/link";
import { formatShortDate, getGuideExcerpt } from "@/lib";
import type { Guide } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type GuideCardProps = {
  guide: Guide;
};

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <Link
      href={`/inspiration/${guide.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
        <AppImage
          src={guide.coverUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Icon name="location" />
          {guide.city}
        </p>
        <h3 className="mt-1 font-semibold group-hover:text-primary">{guide.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{getGuideExcerpt(guide.body)}</p>
        <p className="mt-auto pt-3 text-xs text-muted">{formatShortDate(guide.publishedAt)}</p>
      </div>
    </Link>
  );
};

export default GuideCard;
