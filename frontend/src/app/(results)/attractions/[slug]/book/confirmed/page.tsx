import { AttractionBookingConfirmedScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/attractions/[slug]/book/confirmed">) => {
  return <AttractionBookingConfirmedScreen params={params} searchParams={searchParams} />;
};

export default page;
