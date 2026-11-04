import { AttractionsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/attractions">) => {
  return <AttractionsScreen searchParams={searchParams} />;
};

export default page;
