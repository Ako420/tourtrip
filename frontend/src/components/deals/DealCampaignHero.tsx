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
    <section className="relative -mx-4 -mt-4 flex min-h-64 items-center overflow-hidden bg-primary-deep px-4 py-8 text-white sm:min-h-87.5 lg:-mx-8 lg:-mt-8 lg:px-8">
      <AppImage src={campaign.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/60 to-ink/30" />

      <div className="relative mx-auto w-full max-w-content">
        <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white">
          <Icon name="chevron-left" className="text-xs" />
          All deals
        </Link>
        <h1 className="mt-4 type-hero font-bold">{campaign.title}</h1>
        <p className="mt-2 max-w-xl text-white/85">{campaign.subtitle}</p>
        <p className="mt-5 text-2xl font-bold text-accent">{campaign.headline}</p>
        <p className="mt-1 text-sm text-white/85">Ends {formatShortDate(campaign.endsAt)}</p>
      </div>
    </section>
  );
};

export default DealCampaignHero;
