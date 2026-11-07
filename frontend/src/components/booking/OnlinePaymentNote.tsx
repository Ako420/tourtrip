import Icon from "../ui/Icon";

const OnlinePaymentNote = () => {
  return (
    <section>
      <h2 className="mb-3 text-2xl font-bold">How would you like to pay?</h2>
      <p className="flex items-start gap-3 rounded-md bg-primary-soft p-3 text-sm">
        <Icon name="credit-card" className="mt-0.5 text-primary" />
        <span>
          <strong className="block">Online payment is not connected yet</strong>
          You will not be charged, and no card details are needed.
        </span>
      </p>
    </section>
  );
};

export default OnlinePaymentNote;
