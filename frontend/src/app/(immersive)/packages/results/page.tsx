import { PackageResultsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/packages/results">) => {
  return <PackageResultsScreen searchParams={searchParams} />;
};

export default page;
