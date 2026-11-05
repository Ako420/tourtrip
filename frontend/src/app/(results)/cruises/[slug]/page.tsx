import { CruiseDetailsScreen } from "@/screens";

const page = ({ params }: PageProps<"/cruises/[slug]">) => {
  return <CruiseDetailsScreen params={params} />;
};

export default page;
