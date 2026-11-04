import { Suspense } from "react";
import { HotelDetailsSkeleton, LegalPage } from "@/components";
import { getLegalDocument } from "@/services";
import type { LegalSlug } from "@/types";

type LegalScreenProps = {
  slug: LegalSlug;
};

const LegalContent = async ({ slug }: LegalScreenProps) => {
  return <LegalPage document={await getLegalDocument(slug)} />;
};

const LegalScreen = ({ slug }: LegalScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <LegalContent slug={slug} />
      </Suspense>
    </div>
  );
};

export default LegalScreen;
