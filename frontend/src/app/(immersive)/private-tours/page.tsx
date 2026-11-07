import { ToursScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/private-tours">) => {
  return <ToursScreen type="private" searchParams={searchParams} />;
};

export default page;
