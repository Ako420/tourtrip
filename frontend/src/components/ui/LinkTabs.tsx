import Link from "next/link";

type LinkTabsProps = {
  label: string;
  tabs: { label: string; href: string; isActive: boolean }[];
};

const LinkTabs = ({ label, tabs }: LinkTabsProps) => {
  return (
    <nav aria-label={label} className="scrollbar-none flex gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          scroll={false}
          aria-current={tab.isActive ? "true" : undefined}
          className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
            tab.isActive ? "border-ink bg-ink text-white" : "border-line hover:border-primary hover:text-primary"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default LinkTabs;
