import { CruisesScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/cruises">) => {
  return <CruisesScreen searchParams={searchParams} />;
};

export default page;
