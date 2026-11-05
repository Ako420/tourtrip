import Link from "next/link";
import { authLinks } from "@/constants";
import type { HeroContent } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import SearchForm from "../search/SearchForm";
import ServiceTabs from "../search/ServiceTabs";

type HeroProps = {
  hero: HeroContent;
  destinations: string[];
};

const Hero = ({ hero, destinations }: HeroProps) => {
  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 h-[25rem] overflow-hidden rounded-panel bg-primary-deep">
        <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/65 to-primary/10" />
      </div>

      <div className="relative px-3 pt-10 text-center text-white sm:pt-14">
        <h1 className="type-title font-bold">{hero.title}</h1>

        <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-white/90">
          {hero.guarantees.map((guarantee) => (
            <li key={guarantee.id} className="flex items-center gap-2">
              <Icon name={guarantee.iconName} className="text-accent" />
              {guarantee.label}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-content rounded-panel bg-surface p-4 text-ink shadow-card sm:mt-11 sm:p-6">
          <ServiceTabs />
          <div className="mt-4">
            <SearchForm destinations={destinations} />
          </div>
          <p className="mt-4 border-t border-line pt-4 text-right text-sm">
            <Link href={authLinks.login} className="text-primary hover:underline">
              Sign in or register
            </Link>{" "}
            to unlock member coupons and rewards
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
