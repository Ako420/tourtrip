import { AttractionBookingScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/attractions/[slug]/book">) => {
  return <AttractionBookingScreen params={params} searchParams={searchParams} />;
};

export default page;
