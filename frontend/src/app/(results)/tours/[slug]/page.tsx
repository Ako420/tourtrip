import { TourDetailsScreen } from "@/screens";

const page = ({ params }: PageProps<"/tours/[slug]">) => {
  return <TourDetailsScreen params={params} />;
};

export default page;
