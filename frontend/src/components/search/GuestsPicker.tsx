import { guestLimits } from "@/constants";
import { formatCount } from "@/lib";
import type { GuestCounts } from "@/types";
import CounterRow from "./CounterRow";
import PickerPopover from "./PickerPopover";

type GuestsPickerProps = {
  value: GuestCounts;
  onChange: (value: GuestCounts) => void;
};

const rows = [
  { key: "rooms", label: "Rooms" },
  { key: "adults", label: "Adults" },
  { key: "children", label: "Children" },
] as const;

const GuestsPicker = ({ value, onChange }: GuestsPickerProps) => {
  const summary = [
    formatCount(value.rooms, "room"),
    formatCount(value.adults, "adult"),
    formatCount(value.children, "child", "children"),
  ].join(", ");

  return (
    <PickerPopover iconName="user" summary={summary}>
      {rows.map(({ key, label }) => (
        <CounterRow
          key={key}
          label={label}
          value={value[key]}
          {...guestLimits[key]}
          onChange={(count) => onChange({ ...value, [key]: count })}
        />
      ))}
    </PickerPopover>
  );
};

export default GuestsPicker;
