import { formatShortDate } from "@/lib";

type DateFieldProps = {
  label: string;
  value?: string;
  min?: string;
  onChange: (value: string) => void;
};

const DateField = ({ label, value, min, onChange }: DateFieldProps) => {
  return (
    <label className="relative block cursor-pointer whitespace-nowrap font-semibold">
      <span className={value ? "" : "text-muted"}>{value ? formatShortDate(value) : label}</span>
      <input
        type="date"
        aria-label={label}
        value={value ?? ""}
        min={min}
        onChange={(event) => {
          if (event.target.value) onChange(event.target.value);
        }}
        onClick={(event) => event.currentTarget.showPicker()}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      />
    </label>
  );
};

export default DateField;
