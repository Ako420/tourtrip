import { CarResultsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/cars/results">) => {
  return <CarResultsScreen searchParams={searchParams} />;
};

export default page;
