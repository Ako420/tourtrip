import Link from "next/link";
import type { ReactNode } from "react";
import AppImage from "./AppImage";
import FavoriteButton from "./FavoriteButton";

type PhotoCardProps = {
  href: string;
  imageUrl: string;
  title: string;
  badge?: string;
  children: ReactNode;
};

const PhotoCard = ({ href, imageUrl, title, badge, children }: PhotoCardProps) => {
  return (
    <div className="relative">
      <Link href={href} className="group relative block aspect-[2/3] overflow-hidden rounded-card bg-surface-alt">
        <AppImage
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 18rem, 11rem"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 pt-16 text-white">
          {children}
        </div>
        {badge && (
          <span className="absolute top-3 left-3 rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-accent">
            {badge}
          </span>
        )}
      </Link>
      <FavoriteButton label={title} />
    </div>
  );
};

export default PhotoCard;
