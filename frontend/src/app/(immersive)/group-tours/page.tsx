import { ToursScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/group-tours">) => {
  return <ToursScreen type="group" searchParams={searchParams} />;
};

export default page;
