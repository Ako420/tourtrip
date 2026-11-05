import { HotelsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/hotels/list">) => {
  return <HotelsScreen searchParams={searchParams} />;
};

export default page;
