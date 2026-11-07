import type { HotelsContent } from "@/types";
import SectionHeading from "../ui/SectionHeading";

type HotelsAboutProps = {
  about: HotelsContent["about"];
};

const HotelsAbout = ({ about }: HotelsAboutProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{about.title}</SectionHeading>

      <div className="flex flex-col gap-3 rounded-card border border-line p-5 text-sm text-ink-soft">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};

export default HotelsAbout;
