import { TrainResultsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/trains/results">) => {
  return <TrainResultsScreen searchParams={searchParams} />;
};

export default page;
