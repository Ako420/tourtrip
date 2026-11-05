import Link from "next/link";
import type { LinkItem } from "@/types";
import Icon from "./Icon";

type BreadcrumbProps = {
  links: LinkItem[];
  current: string;
};

const Breadcrumb = ({ links, current }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href} className="flex items-center gap-2">
            <Link href={link.href} className="transition-colors duration-300 ease-out hover:text-primary">
              {link.label}
            </Link>
            <Icon name="chevron-right" className="text-tiny" />
          </li>
        ))}
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
