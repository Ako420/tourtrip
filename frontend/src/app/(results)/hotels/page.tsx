import { HotelsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/hotels">) => {
  return <HotelsScreen searchParams={searchParams} />;
};

export default page;
