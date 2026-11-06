import Button from "../ui/Button";

type BookingSubmitCardProps = {
  total: string;
  isPending: boolean;
};

const BookingSubmitCard = ({ total, isPending }: BookingSubmitCardProps) => {
  return (
    <div className="rounded-card bg-surface p-5">
      <p className="mb-3 flex items-baseline justify-between gap-4">
        <span className="font-bold">Total</span>
        <span className="text-2xl font-bold text-primary">{total}</span>
      </p>
      <Button type="submit" size="lg" disabled={isPending} className="w-full text-lg disabled:opacity-60">
        {isPending ? "Booking..." : "Book now"}
      </Button>
    </div>
  );
};

export default BookingSubmitCard;
