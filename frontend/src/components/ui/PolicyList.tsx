import type { HotelPolicy } from "@/types";
import Icon from "./Icon";

type PolicyListProps = {
  policies: HotelPolicy[];
  id?: string;
  title?: string;
};

const PolicyList = ({ policies, id = "policies", title = "Policies" }: PolicyListProps) => {
  return (
    <section id={id} className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <dl className="divide-y divide-line rounded-card border border-line px-4">
        {policies.map((policy) => (
          <div key={policy.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt className="flex items-center gap-2 text-sm font-semibold sm:w-56 sm:shrink-0">
              <Icon name={policy.iconName} className="w-4 text-primary" />
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
