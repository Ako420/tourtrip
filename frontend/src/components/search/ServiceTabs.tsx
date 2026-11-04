import Link from "next/link";
import { serviceTabs } from "@/constants";
import Icon from "../ui/Icon";

const ServiceTabs = () => {
  return (
    <nav aria-label="Travel services" className="scrollbar-none -mx-2 overflow-x-auto">
      <ul className="flex min-w-max justify-center">
        {serviceTabs.map((tab, index) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={index === 0 ? "page" : undefined}
              className={`flex w-32 flex-col items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors duration-300 ease-out lg:w-36 ${
                index === 0 ? "border-primary text-primary" : "border-transparent text-ink hover:text-primary"
              }`}
            >
              {tab.iconName && <Icon name={tab.iconName} className="text-3xl text-primary" />}
              <span className="whitespace-nowrap">{tab.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ServiceTabs;
