import Link from "next/link";
import { formatShortDate } from "@/lib";
import type { DealCampaign } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type DealCampaignHeroProps = {
  campaign: DealCampaign;
};

const DealCampaignHero = ({ campaign }: DealCampaignHeroProps) => {
  return (
    <section className="relative overflow-hidden rounded-card bg-primary-deep px-6 py-10 text-white sm:px-10 sm:py-16">
      <AppImage src={campaign.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/60 to-ink/30" />

      <div className="relative mx-auto max-w-content">
        <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
          <Icon name="chevron-left" className="text-xs" />
          All deals
        </Link>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{campaign.title}</h1>
        <p className="mt-2 max-w-xl text-white/85">{campaign.subtitle}</p>
        <p className="mt-5 text-2xl font-bold text-accent">{campaign.headline}</p>
        <p className="mt-1 text-sm text-white/85">Ends {formatShortDate(campaign.endsAt)}</p>
      </div>
    </section>
  );
};

export default DealCampaignHero;
