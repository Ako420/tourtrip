import { CruiseDetailsScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/cruises/[slug]">) => {
  return <CruiseDetailsScreen params={params} searchParams={searchParams} />;
};

export default page;
