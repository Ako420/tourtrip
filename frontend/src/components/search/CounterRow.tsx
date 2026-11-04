import Icon from "../ui/Icon";

type CounterRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const stepButtonClass =
  "flex size-8 items-center justify-center rounded-full border border-line text-primary transition-colors duration-200 hover:bg-primary-soft disabled:text-muted disabled:hover:bg-transparent";

const CounterRow = ({ label, value, min, max, onChange }: CounterRowProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Remove from ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={stepButtonClass}
        >
          <Icon name="minus" />
        </button>
        <span className="w-5 text-center font-semibold" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Add to ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className={stepButtonClass}
        >
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
};

export default CounterRow;
