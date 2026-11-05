import type { RewardsProgram } from "@/types";

type RewardsHeroProps = {
  hero: RewardsProgram["hero"];
};

const RewardsHero = ({ hero }: RewardsHeroProps) => {
  return (
    <section className="bg-primary px-4 pt-36 pb-36 text-center text-white">
      <h1 className="type-hero font-bold">
        {hero.title}
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-2 text-lg sm:text-xl">{hero.subtitle}</p>
    </section>
  );
};

export default RewardsHero;
