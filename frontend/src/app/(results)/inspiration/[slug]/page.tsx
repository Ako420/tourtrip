import { GuideDetailsScreen } from "@/screens";

const page = ({ params }: PageProps<"/inspiration/[slug]">) => {
  return <GuideDetailsScreen params={params} />;
};

export default page;
