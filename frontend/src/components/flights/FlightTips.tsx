import type { FlightTip, Section } from "@/types";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";

type FlightTipsProps = {
  section: Section<FlightTip>;
};

const FlightTips = ({ section }: FlightTipsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <div className="divide-y divide-line rounded-card px-5 shadow-card">
        {section.items.map((tip) => (
          <details key={tip.id} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold transition-colors duration-300 ease-out hover:text-primary [&::-webkit-details-marker]:hidden">
              {tip.question}
              <Icon name="chevron-down" className="text-xs transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-sm text-ink-soft">{tip.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FlightTips;
