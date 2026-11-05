import Link from "next/link";
import { formatShortDate } from "@/lib";
import type { HomeRoute } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type RouteCardProps = {
  route: HomeRoute;
};

const RouteCard = ({ route }: RouteCardProps) => {
  return (
    <Link href={route.href} className="group flex h-full flex-col overflow-hidden rounded-card border border-line">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <AppImage
          src={route.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 18rem, 11rem"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="flex flex-wrap items-center gap-x-2 font-medium group-hover:text-primary">
          <Icon name="plane" className="text-sm" />
          {route.from}
          <Icon name="chevron-right" className="text-tiny" />
          {route.to}
        </p>
        <p className="mt-1 text-xs text-muted">{formatShortDate(route.date)}</p>
        <p className="mt-auto pt-2 font-bold">
          From <Price amount={route.price} currency={route.currency} />
        </p>
      </div>
    </Link>
  );
};

export default RouteCard;
