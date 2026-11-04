import { formatClockTime, formatCount, formatDuration, formatShortDate } from "@/lib";
import type { FlightLeg } from "@/types";
import Icon from "../ui/Icon";

type FlightLegRowProps = {
  leg: FlightLeg;
  showDate?: boolean;
};

const FlightLegRow = ({ leg, showDate = true }: FlightLegRowProps) => {
  const arrivalMinutes = leg.departMinutes + leg.durationMinutes;
  const dayOffset = Math.floor(arrivalMinutes / 1440);
  const stopLabel = leg.stops === 0 ? "Nonstop" : formatCount(leg.stops, "stop");

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <div>
        <p className="text-lg font-bold">{formatClockTime(leg.departMinutes)}</p>
        <p className="text-xs text-muted">{leg.from}</p>
      </div>

      <div className="min-w-0 text-center">
        <p className="text-xs text-muted">{formatDuration(leg.durationMinutes)}</p>
        <div className="relative my-1 h-px bg-line">
          <Icon name="plane" className="absolute -top-1.5 right-0 text-xs text-primary" />
        </div>
        <p className={`truncate text-xs ${leg.stops === 0 ? "text-success" : "text-muted"}`}>
          {stopLabel}
          {leg.stopCity && ` via ${leg.stopCity}`}
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold">
          {formatClockTime(arrivalMinutes)}
          {dayOffset > 0 && <sup className="ml-0.5 text-xs text-accent">+{dayOffset}</sup>}
        </p>
        <p className="text-xs text-muted">{leg.to}</p>
      </div>

      {showDate && <p className="col-span-3 -mt-2 text-xs text-muted sm:hidden">{formatShortDate(leg.date)}</p>}
    </div>
  );
};

export default FlightLegRow;
