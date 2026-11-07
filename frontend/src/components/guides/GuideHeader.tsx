import { formatLongDate } from "@/lib";
import type { Guide } from "@/types";
import Breadcrumb from "../ui/Breadcrumb";

type GuideHeaderProps = {
  guide: Guide;
};

const GuideHeader = ({ guide }: GuideHeaderProps) => {
  return (
    <header className="mx-auto max-w-content">
      <Breadcrumb links={[{ label: "Travel Inspiration", href: "/inspiration" }]} current={guide.city} />

      <h1 className="mt-6 type-section-lg font-bold">{guide.title}</h1>

      <div className="mt-4 flex items-center gap-3 border-b border-line pb-4">
        <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          Jr
        </span>
        <p className="text-sm text-ink-soft">
          by Hotel Jr
          <span className="block">{formatLongDate(guide.publishedAt)}</span>
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;
