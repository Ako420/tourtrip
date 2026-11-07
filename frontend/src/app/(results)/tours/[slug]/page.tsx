import { TourDetailsScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/tours/[slug]">) => {
  return <TourDetailsScreen params={params} searchParams={searchParams} />;
};

export default page;
