import type { MobileAppContent } from "@/types";
import Icon from "../ui/Icon";

type MobileAppHeroProps = {
  hero: MobileAppContent["hero"];
};

const MobileAppHero = ({ hero }: MobileAppHeroProps) => {
  return (
    <section className="bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <div className="mx-auto flex max-w-content items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            {hero.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-white/85">{hero.subtitle}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium">
            <Icon name="info" />
            {hero.status}
          </p>
        </div>
        <span className="hidden size-32 shrink-0 items-center justify-center rounded-full bg-white/10 text-6xl sm:flex">
          <Icon name="phone" />
        </span>
      </div>
    </section>
  );
};

export default MobileAppHero;
