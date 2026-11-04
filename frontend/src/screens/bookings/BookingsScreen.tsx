import { BookingLookupForm, ButtonLink } from "@/components";
import { authLinks } from "@/constants";
import { getSampleBookingHint } from "@/services";

const BookingsScreen = () => {
  const sampleHint = getSampleBookingHint();

  return (
    <div className="mx-auto max-w-3xl pb-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Find your booking</h1>
      <p className="mt-1 mb-6 text-muted">Enter your reference and the email you booked with.</p>

      <BookingLookupForm />

      {sampleHint && (
        <aside aria-label="Sample bookings" className="mt-6 rounded-card bg-primary-soft p-4 text-sm">
          <p className="font-semibold">Try a sample booking</p>
          <p className="mt-1 text-ink-soft">
            Bookings are not saved yet. Use <strong>{sampleHint.email}</strong> with{" "}
            {sampleHint.references.map((reference, index) => (
              <span key={reference}>
                {index > 0 && ", "}
                <strong>{reference}</strong>
              </span>
            ))}
            .
          </p>
        </aside>
      )}

      <section className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <div>
          <h2 className="font-semibold">Have an account?</h2>
          <p className="text-sm text-muted">Sign in to keep your trips in one place.</p>
        </div>
        <ButtonLink href={authLinks.login} variant="outline">
          Sign in
        </ButtonLink>
      </section>
    </div>
  );
};

export default BookingsScreen;
