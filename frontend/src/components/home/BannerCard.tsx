import Link from "next/link";
import type { Banner, BannerTheme } from "@/types";
import AppImage from "../ui/AppImage";

type BannerCardProps = {
  banner: Banner;
  className?: string;
};

const overlayClass: Record<BannerTheme, string> = {
  primary: "from-primary-deep/95 via-primary-deep/80 to-transparent",
  sunset: "from-ink/80 via-ink/55 to-transparent",
};

const BannerCard = ({ banner, className = "" }: BannerCardProps) => {
  return (
    <Link
      href={banner.href}
      className={`group relative flex min-h-44 flex-col items-start justify-center overflow-hidden rounded-card bg-primary-deep p-6 text-white lg:min-h-48 ${className}`}
    >
      <AppImage
        src={banner.imageUrl}
        alt=""
        fill
        sizes="(min-width: 1024px) 40rem, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${overlayClass[banner.theme]}`} />
      <div className="relative">
        <p className="text-sm font-medium text-white/80">{banner.eyebrow}</p>
        <h3 className="mt-1 text-2xl font-extrabold">{banner.title}</h3>
        <p className="mt-1 text-sm text-white/90">{banner.subtitle}</p>
        <span className="mt-3 inline-block rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-ink">
          {banner.ctaLabel}
        </span>
      </div>
    </Link>
  );
};

export default BannerCard;
