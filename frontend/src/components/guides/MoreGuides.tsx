import type { Guide } from "@/types";
import MoreLink from "../ui/MoreLink";
import SectionHeading from "../ui/SectionHeading";
import GuideGrid from "./GuideGrid";

type MoreGuidesProps = {
  guides: Guide[];
};

const MoreGuides = ({ guides }: MoreGuidesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading action={<MoreLink href="/inspiration" label="See all guides" />}>More travel guides</SectionHeading>
      <GuideGrid guides={guides} />
    </section>
  );
};

export default MoreGuides;
