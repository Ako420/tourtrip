import type { IconName } from "@/constants";
import Icon from "./Icon";

type PillTabsProps<Id extends string> = {
  options: readonly { id: Id; label: string; iconName?: IconName }[];
  activeId: Id;
  onChange: (id: Id) => void;
};

const PillTabs = <Id extends string>({ options, activeId, onChange }: PillTabsProps<Id>) => {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === activeId}
          onClick={() => onChange(option.id)}
          className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
            option.id === activeId ? "border-ink bg-ink text-white" : "border-line hover:border-primary hover:text-primary"
          }`}
        >
          {option.iconName && <Icon name={option.iconName} />}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PillTabs;
