import type { FlightTip, Section } from "@/types";
import FaqList from "../ui/FaqList";
import SectionHeading from "../ui/SectionHeading";

type FlightTipsProps = {
  section: Section<FlightTip>;
};

const FlightTips = ({ section }: FlightTipsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <FaqList items={section.items} />
    </section>
  );
};

export default FlightTips;
