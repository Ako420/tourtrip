import { TrainsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/trains">) => {
  return <TrainsScreen searchParams={searchParams} />;
};

export default page;
