import Link from "next/link";
import type { FlightsContent } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type AppPromoProps = {
  app: FlightsContent["app"];
};

const stores = [
  { label: "App Store", iconName: "apple" },
  { label: "Google Play", iconName: "google-play" },
] as const;

const AppPromo = ({ app }: AppPromoProps) => {
  return (
    <section className="relative mt-12 overflow-hidden bg-primary-deep px-4 py-12 text-white sm:py-16">
      <AppImage src={app.imageUrl} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deep via-primary-deep/70 to-transparent" />

      <div className="relative mx-auto max-w-content">
        <h2 className="text-3xl font-bold">
          {app.title}
          <span className="text-accent">.</span>
        </h2>

        <ul className="mt-4 flex flex-wrap gap-2">
          {app.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm">
              <Icon name="check" className="text-xs" />
              {benefit}
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex gap-8">
          {app.stats.map((stat) => (
            <div key={stat.id}>
              <dd className="text-2xl font-bold">{stat.value}</dd>
              <dt className="text-sm text-white/85">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-3">
          {stores.map((store) => (
            <li key={store.label}>
              <Link
                href="/app"
                className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out hover:bg-ink-soft"
              >
                <Icon name={store.iconName} className="text-lg" />
                {store.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AppPromo;
