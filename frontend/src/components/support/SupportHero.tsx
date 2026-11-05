import type { ReactNode } from "react";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type SupportHeroProps = {
  accountLink: ReactNode;
};

const SupportHero = ({ accountLink }: SupportHeroProps) => {
  return (
    <section className="overflow-hidden rounded-card bg-primary-deep px-6 py-10 text-white sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-content items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            Customer support<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-white/80">Find an answer, check your booking or send us a message.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/bookings" variant="inverse" size="sm">
              Find bookings
            </ButtonLink>
            {accountLink}
          </div>
        </div>
        <span className="hidden size-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-5xl sm:flex">
          <Icon name="headset" />
        </span>
      </div>
    </section>
  );
};

export default SupportHero;
