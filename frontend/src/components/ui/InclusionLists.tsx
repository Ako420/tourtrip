import type { IconName } from "@/constants";
import Icon from "./Icon";

type InclusionListsProps = {
  included: string[];
  notIncluded: string[];
};

const groups: { title: string; key: "included" | "notIncluded"; iconName: IconName; iconClass: string }[] = [
  { title: "What's included", key: "included", iconName: "check", iconClass: "text-success" },
  { title: "Not included", key: "notIncluded", iconName: "info", iconClass: "text-muted" },
];

const InclusionLists = (lists: InclusionListsProps) => {
  return (
    <section className="mt-10 grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.key} className="rounded-card border border-line p-5">
          <h2 className="mb-3 text-lg font-bold">{group.title}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {lists[group.key].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon name={group.iconName} className={`mt-0.5 ${group.iconClass}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default InclusionLists;
