import Icon from "../ui/Icon";

const RewardsHero = () => {
  return (
    <section className="rounded-card bg-primary-deep px-6 py-10 text-white sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-content items-center justify-between gap-8">
        <div>
          <h1 className="type-hero font-bold">
            Hotel Jr Rewards<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-white/80">Earn Jr Coins on your bookings, and use them on your next trip.</p>
        </div>
        <span className="hidden size-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-5xl text-accent sm:flex">
          <Icon name="coins" />
        </span>
      </div>
    </section>
  );
};

export default RewardsHero;
