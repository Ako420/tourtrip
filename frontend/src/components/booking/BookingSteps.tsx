type BookingStepsProps = {
  current: 1 | 2;
};

const steps = ["Your details", "Confirmation"];

const BookingSteps = ({ current }: BookingStepsProps) => {
  return (
    <ol className="flex items-center gap-3 text-sm">
      {steps.map((step, index) => {
        const number = index + 1;

        return (
          <li key={step} aria-current={number === current ? "step" : undefined} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden className="h-px w-8 bg-line" />}
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                number <= current ? "bg-primary text-white" : "bg-surface-alt text-muted"
              }`}
            >
              {number}
            </span>
            <span className={number === current ? "font-semibold" : "text-muted"}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default BookingSteps;
