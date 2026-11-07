import Link from "next/link";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type SupportAppProps = {
  app: { title: string; imageUrl: string; benefits: string[]; ctaLabel: string; ctaHref: string };
};

const SupportApp = ({ app }: SupportAppProps) => {
  return (
    <section className="mx-auto mt-4 grid max-w-content overflow-hidden rounded-card bg-surface shadow-card md:grid-cols-[44%_1fr]">
      <div className="relative h-56 bg-surface-alt md:h-auto md:min-h-90">
        <AppImage src={app.imageUrl} alt="" fill sizes="(min-width: 768px) 32rem, 100vw" className="object-cover" />
      </div>

      <div className="flex flex-col justify-center p-6 md:p-14">
        <h2 className="text-2xl font-bold">{app.title}</h2>
        <ul className="mt-4 space-y-3 text-ink-soft">
          {app.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <Icon name="check" className="text-primary" />
              {benefit}
            </li>
          ))}
        </ul>
        <Link href={app.ctaHref} className="mt-4 flex items-center gap-2 text-primary hover:underline">
          {app.ctaLabel}
          <Icon name="chevron-right" className="text-xs" />
        </Link>
      </div>
    </section>
  );
};

export default SupportApp;
