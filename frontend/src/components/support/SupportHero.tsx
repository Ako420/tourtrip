import type { ReactNode } from "react";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type SupportHeroProps = {
  accountLink: ReactNode;
};

const SupportHero = ({ accountLink }: SupportHeroProps) => {
  return (
    <section className="bg-primary-deep px-4 pt-32 pb-16 text-white xl:pt-22 xl:pb-20">
      <div className="mx-auto flex max-w-content items-center justify-between gap-8">
        <div>
          <h1 className="type-hero font-bold">
            Customer support<span className="text-accent">.</span>
          </h1>
          <p className="mt-1 text-white/90">Find an answer, check your booking or send us a message.</p>
          <div className="mt-4 flex flex-wrap gap-2">
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
