import { FlightResultsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/flights/results">) => {
  return <FlightResultsScreen searchParams={searchParams} />;
};

export default page;
