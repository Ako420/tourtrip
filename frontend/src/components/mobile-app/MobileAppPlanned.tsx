import type { MobileAppContent } from "@/types";
import Icon from "../ui/Icon";

type MobileAppPlannedProps = {
  section: MobileAppContent["planned"];
};

const MobileAppPlanned = ({ section }: MobileAppPlannedProps) => {
  return (
    <section className="mt-10 px-4 pb-8 lg:mt-12">
      <div className="mx-auto max-w-content">
        <h2 className="mb-4 text-lg font-medium text-white">{section.title}</h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item) => (
            <li key={item.id} className="rounded-card bg-surface p-6">
              <Icon name={item.iconName} className="text-4xl text-primary" />
              <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MobileAppPlanned;
