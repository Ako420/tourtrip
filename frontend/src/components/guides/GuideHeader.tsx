import { formatShortDate } from "@/lib";
import type { Guide } from "@/types";
import AppImage from "../ui/AppImage";
import Breadcrumb from "../ui/Breadcrumb";

type GuideHeaderProps = {
  guide: Guide;
};

const GuideHeader = ({ guide }: GuideHeaderProps) => {
  return (
    <header className="mx-auto max-w-content">
      <Breadcrumb links={[{ label: "Travel Inspiration", href: "/inspiration" }]} current={guide.city} />

      <div className="relative mt-4 overflow-hidden rounded-card bg-primary-deep px-6 pt-24 pb-8 text-white sm:px-10 sm:pt-40 sm:pb-10">
        <AppImage src={guide.coverUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />

        <div className="relative">
          <p className="text-sm text-white/85">
            {guide.city} · {formatShortDate(guide.publishedAt)}
          </p>
          <h1 className="mt-1 max-w-3xl text-3xl font-bold sm:text-5xl">{guide.title}</h1>
        </div>
      </div>
    </header>
  );
};

export default GuideHeader;
