import type { LinkItem } from "@/types";

type SectionNavProps = {
  label: string;
  links: LinkItem[];
};

const SectionNav = ({ label, links }: SectionNavProps) => {
  return (
    <nav aria-label={label} className="flex justify-center gap-10">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="transition-colors duration-300 ease-out hover:text-primary">
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default SectionNav;
