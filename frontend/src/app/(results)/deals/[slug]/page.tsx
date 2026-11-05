import { DealDetailsScreen } from "@/screens";

const page = ({ params }: PageProps<"/deals/[slug]">) => {
  return <DealDetailsScreen params={params} />;
};

export default page;
