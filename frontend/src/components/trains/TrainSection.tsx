import type { ReactNode } from "react";
import SectionHeading from "../ui/SectionHeading";

type TrainSectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
};

const TrainSection = ({ id, title, children }: TrainSectionProps) => {
  return (
    <section id={id} className="mx-auto mt-16 max-w-content scroll-mt-24 sm:mt-24">
      <SectionHeading size="lg">{title}</SectionHeading>
      {children}
    </section>
  );
};

export default TrainSection;
