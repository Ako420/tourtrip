import { AttractionDetailsScreen } from "@/screens";

const page = ({ params }: PageProps<"/attractions/[slug]">) => {
  return <AttractionDetailsScreen params={params} />;
};

export default page;
