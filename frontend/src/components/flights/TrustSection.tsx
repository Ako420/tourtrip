import Link from "next/link";
import type { FlightsContent } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

type TrustSectionProps = {
  section: FlightsContent["trust"];
};

const TrustSection = ({ section }: TrustSectionProps) => {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        action={
          section.moreHref && (
            <Link href={section.moreHref} className="flex shrink-0 items-center gap-2 text-sm font-medium hover:text-primary">
              {section.moreLabel}
              <Icon name="chevron-right" className="text-xs" />
            </Link>
          )
        }
      >
        {section.title}
      </SectionHeading>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item) => (
          <li key={item.id} className="rounded-card border border-line p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-lg text-primary">
              <Icon name={item.iconName} />
            </span>
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrustSection;
