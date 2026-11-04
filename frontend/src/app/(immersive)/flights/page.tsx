import { FlightsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/flights">) => {
  return <FlightsScreen searchParams={searchParams} />;
};

export default page;
