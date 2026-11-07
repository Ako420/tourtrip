import { guideSectionLinks } from "@/constants";
import Icon from "../ui/Icon";

const GuideSectionLinks = () => {
  return (
    <nav aria-label="Page sections" className="mt-10 flex flex-wrap justify-center gap-3">
      {guideSectionLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex items-center gap-3 rounded-full border border-line px-5 py-2.5 transition-colors duration-300 ease-out hover:border-primary hover:text-primary"
        >
          {link.label}
          <Icon name="arrow-right" className="text-xs" />
        </a>
      ))}
    </nav>
  );
};

export default GuideSectionLinks;
