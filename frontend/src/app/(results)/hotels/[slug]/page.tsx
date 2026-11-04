import { HotelDetailsScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/hotels/[slug]">) => {
  return <HotelDetailsScreen params={params} searchParams={searchParams} />;
};

export default page;
