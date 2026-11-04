import { formatPrice } from "@/lib";
import type { PlannerSuggestion } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type SuggestionListProps = {
  title: string;
  suggestions: PlannerSuggestion[];
  plannedIds: Set<string>;
  dayLabel: string;
  onAdd: (suggestion: PlannerSuggestion) => void;
};

const SuggestionList = ({ title, suggestions, plannedIds, dayLabel, onAdd }: SuggestionListProps) => {
  return (
    <section aria-label="Suggestions" className="rounded-card border border-line p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="mb-3 text-sm text-muted">Add to {dayLabel}</p>

      <ul className="flex flex-col gap-3">
        {suggestions.map((suggestion) => {
          const isPlanned = plannedIds.has(suggestion.id);

          return (
            <li key={suggestion.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                <AppImage src={suggestion.imageUrl} alt="" fill sizes="3.5rem" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{suggestion.name}</p>
                <p className="truncate text-xs text-muted">
                  {suggestion.city} · {formatPrice(suggestion.price, suggestion.currency)}
                </p>
              </div>
              <button
                type="button"
                aria-label={isPlanned ? `${suggestion.name} is in your plan` : `Add ${suggestion.name}`}
                disabled={isPlanned}
                onClick={() => onAdd(suggestion)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm text-primary transition-colors duration-200 hover:bg-primary hover:text-white disabled:bg-transparent disabled:text-success"
              >
                <Icon name={isPlanned ? "check" : "plus"} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SuggestionList;
