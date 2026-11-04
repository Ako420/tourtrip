import Icon from "../ui/Icon";

const OnlinePaymentNote = () => {
  return (
    <section className="rounded-card border border-line p-5">
      <h2 className="mb-2 text-lg font-bold">Payment</h2>
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
