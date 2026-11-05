import { PackagesScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/packages">) => {
  return <PackagesScreen searchParams={searchParams} />;
};

export default page;
