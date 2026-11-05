import Link from "next/link";
import { formatShortDate } from "@/lib";
import type { DealCampaign } from "@/types";
import AppImage from "../ui/AppImage";

type DealCampaignCardProps = {
  campaign: DealCampaign;
};

const DealCampaignCard = ({ campaign }: DealCampaignCardProps) => {
  return (
    <Link
      href={`/deals/${campaign.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-surface-alt">
        <AppImage
          src={campaign.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
        <p className="absolute bottom-3 left-4 text-2xl font-bold text-white">{campaign.headline}</p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg group-hover:text-primary">{campaign.title}</h3>
        <p className="mt-1 text-xs text-ink-soft">{campaign.subtitle}</p>
        <p className="mt-auto pt-3 text-xs text-muted">Ends {formatShortDate(campaign.endsAt)}</p>
      </div>
    </Link>
  );
};

export default DealCampaignCard;
