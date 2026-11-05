import Link from "next/link";
import Icon from "./Icon";

type MoreLinkProps = {
  href: string;
  label: string;
};

const MoreLink = ({ href, label }: MoreLinkProps) => {
  return (
    <Link href={href} aria-label={label} className="flex shrink-0 items-center gap-2 text-lg hover:text-primary">
      More
      <Icon name="chevron-right" className="text-xs" />
    </Link>
  );
};

export default MoreLink;
