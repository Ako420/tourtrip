import type { FlightsContent } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type AppPromoProps = {
  app: FlightsContent["app"];
};

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

        <ButtonLink href={app.ctaHref} variant="inverse" className="mt-6">
          {app.ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
};

export default AppPromo;
