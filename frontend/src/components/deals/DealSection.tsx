import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "../ui/Icon";

type DealSectionProps = {
  title: string;
  moreHref: string;
  moreLabel: string;
  children: ReactNode;
};

const DealSection = ({ title, moreHref, moreLabel, children }: DealSectionProps) => {
  return (
    <section className="mx-auto mt-8 max-w-content rounded-card bg-primary-soft p-4 sm:p-6">
      <h2 className="mb-5 text-center text-2xl font-bold">{title}</h2>
      {children}
      <div className="mt-5 text-center">
        <Link href={moreHref} className="inline-flex items-center gap-2 hover:text-primary">
          {moreLabel}
          <Icon name="chevron-right" className="text-xs" />
        </Link>
      </div>
    </section>
  );
};

export default DealSection;
