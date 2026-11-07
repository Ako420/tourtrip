import Icon from "../ui/Icon";

type OnlinePaymentNoteProps = {
  compact?: boolean;
};

const OnlinePaymentNote = ({ compact = false }: OnlinePaymentNoteProps) => {
  const note = (
    <p className="flex items-start gap-3 rounded-md bg-primary-soft p-3 text-sm">
      <Icon name="credit-card" className="mt-0.5 text-primary" />
      <span>
        <strong className="block">Online payment is not connected yet</strong>
        You will not be charged, and no card details are needed.
      </span>
    </p>
  );

  if (compact) return note;

  return (
    <section>
      <h2 className="mb-3 text-2xl font-bold">How would you like to pay?</h2>
      {note}
    </section>
  );
};

export default OnlinePaymentNote;
