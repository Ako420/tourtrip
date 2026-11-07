import type { HotelPolicy } from "@/types";
import Icon from "./Icon";

type PolicyListProps = {
  policies: HotelPolicy[];
  id?: string;
  title?: string;
  compact?: boolean;
};

const PolicyList = ({ policies, id = "policies", title = "Policies", compact = false }: PolicyListProps) => {
  return (
    <section id={id} className={`scroll-mt-32 ${compact ? "rounded-card bg-surface p-5" : "mt-10"}`}>
      <h2 className={`font-bold ${compact ? "mb-2 text-xl" : "mb-4 text-2xl"}`}>{title}</h2>
      <dl>
        {policies.map((policy) => (
          <div key={policy.id} className={`flex flex-col gap-1 py-3 ${compact ? "" : "sm:flex-row sm:gap-6"}`}>
            <dt className={`flex items-center gap-3 text-sm font-medium ${compact ? "" : "sm:w-64 sm:shrink-0"}`}>
              <Icon name={policy.iconName} className="w-4 text-ink-soft" />
              {policy.title}
            </dt>
            <dd className="text-sm text-ink-soft">{policy.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default PolicyList;
