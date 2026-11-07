import Link from "next/link";
import type { SupportOption } from "@/types";
import Icon from "../ui/Icon";

type SupportWaysProps = {
  items: SupportOption[];
};

const SupportWays = ({ items }: SupportWaysProps) => {
  return (
    <nav
      aria-label="Ways to get help"
      className="mx-auto mt-4 grid max-w-content divide-line rounded-card bg-surface shadow-card max-sm:divide-y sm:grid-cols-2 sm:divide-x lg:grid-cols-4"
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="flex items-center justify-center gap-3 p-5 text-ink-soft transition-colors duration-300 ease-out hover:text-primary"
        >
          <Icon name={item.iconName} className="text-lg" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default SupportWays;
