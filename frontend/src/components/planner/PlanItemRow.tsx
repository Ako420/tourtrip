import Link from "next/link";
import { formatPrice } from "@/lib";
import type { PlanItem } from "@/types";
import Icon from "../ui/Icon";

type PlanItemRowProps = {
  item: PlanItem;
  currency: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: 1 | -1) => void;
  onRemove: () => void;
};

const iconButtonClass =
  "flex size-8 items-center justify-center rounded-md text-sm text-muted transition-colors duration-200 hover:bg-surface-alt hover:text-ink disabled:text-line disabled:hover:bg-transparent";

const PlanItemRow = ({ item, currency, isFirst, isLast, onMove, onRemove }: PlanItemRowProps) => {
  return (
    <li className="flex items-center gap-3 rounded-card border border-line p-3">
      <div className="w-12 shrink-0 text-sm font-semibold text-primary">{item.time ?? "Any"}</div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {item.href ? (
            <Link href={item.href} className="transition-colors duration-300 ease-out hover:text-primary">
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </p>
        <p className="truncate text-xs text-muted">
          {item.cost > 0 ? formatPrice(item.cost, currency) : "Free"}
          {item.note && ` · ${item.note}`}
        </p>
      </div>

      <div className="flex shrink-0">
        <button
          type="button"
          aria-label={`Move ${item.title} up`}
          disabled={isFirst}
          onClick={() => onMove(-1)}
          className={iconButtonClass}
        >
          <Icon name="chevron-up" />
        </button>
        <button
          type="button"
          aria-label={`Move ${item.title} down`}
          disabled={isLast}
          onClick={() => onMove(1)}
          className={iconButtonClass}
        >
          <Icon name="chevron-down" />
        </button>
        <button type="button" aria-label={`Remove ${item.title}`} onClick={onRemove} className={iconButtonClass}>
          <Icon name="close" />
        </button>
      </div>
    </li>
  );
};

export default PlanItemRow;
