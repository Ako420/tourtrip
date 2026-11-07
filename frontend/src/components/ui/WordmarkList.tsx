import type { IconName } from "@/constants";
import Icon from "./Icon";

type WordmarkListProps = {
  names: string[];
  iconName: IconName;
};

const WordmarkList = ({ names, iconName }: WordmarkListProps) => {
  return (
    <ul className="grid gap-8 rounded-card bg-surface p-8 shadow-card sm:grid-cols-3">
      {names.map((name) => (
        <li key={name} className="flex items-center justify-center gap-3 text-xl font-bold text-ink-soft">
          <Icon name={iconName} className="text-primary" />
          {name}
        </li>
      ))}
    </ul>
  );
};

export default WordmarkList;
