import Icon from "../ui/Icon";

type BookingStepsProps = {
  current: 2 | 3;
};

const steps = ["Your selection", "Your details", "Confirmation"];

const BookingSteps = ({ current }: BookingStepsProps) => {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {steps.map((step, index) => {
        const number = index + 1;
        const isDone = number < current;

        return (
          <li key={step} aria-current={number === current ? "step" : undefined} className="flex items-center gap-2">
            {index > 0 && <Icon name="chevron-right" className="text-xs text-muted" />}
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                number <= current ? "bg-primary text-white" : "bg-ink text-white"
              }`}
            >
              {isDone ? <Icon name="check" /> : number}
            </span>
            <span className={number === current ? "font-semibold" : ""}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default BookingSteps;
