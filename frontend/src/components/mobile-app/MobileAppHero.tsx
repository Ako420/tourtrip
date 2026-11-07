import Link from "next/link";
import type { MobileAppContent } from "@/types";
import Icon from "../ui/Icon";

type MobileAppHeroProps = {
  hero: MobileAppContent["hero"];
  today: MobileAppContent["today"];
};

const pageEdge = "max(1rem, calc((100% - 72.5rem) / 2))";

const bubbles = [
  { name: "bed", position: "top-1/4 -left-8" },
  { name: "plane", position: "-top-2 right-4" },
  { name: "train", position: "right-0 bottom-1/4" },
  { name: "car", position: "bottom-0 left-12" },
] as const;

const MobileAppHero = ({ hero, today }: MobileAppHeroProps) => {
  return (
    <section className="relative pt-32 text-white xl:pt-36">
      <div className="px-4">
        <div className="mx-auto max-w-content">
          <h1 className="type-hero font-bold">
            {hero.title}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-2 max-w-3xl text-lg sm:text-xl">{hero.subtitle}</p>
        </div>
      </div>

      <div
        style={{ paddingLeft: pageEdge }}
        className="mt-10 bg-white/10 py-10 pr-4 lg:mt-16 lg:w-[60%] lg:rounded-r-[9rem] lg:pr-24"
      >
        <p className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium">
          <Icon name="info" />
          {hero.status}
        </p>
        <h2 className="mt-4 text-2xl">{today.title}</h2>

        <ul className="mt-4 grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-white/30">
          {today.items.map((item) => (
            <li key={item.id} className="sm:pr-4 sm:not-first:pl-4">
              <Link href={item.href} className="group block">
                <span className="block font-bold group-hover:underline">{item.title}</span>
                <span className="mt-1 block text-sm text-white/85">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden
        style={{ right: `calc(${pageEdge} + 2rem)` }}
        className="absolute bottom-0 hidden size-80 items-center justify-center rounded-full bg-white/10 text-8xl lg:flex"
      >
        <Icon name="phone" />
        {bubbles.map((bubble) => (
          <span
            key={bubble.name}
            className={`absolute flex size-16 items-center justify-center rounded-full bg-surface text-2xl text-primary ${bubble.position}`}
          >
            <Icon name={bubble.name} />
          </span>
        ))}
      </div>
    </section>
  );
};

export default MobileAppHero;
