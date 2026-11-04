import { CarsScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/cars">) => {
  return <CarsScreen searchParams={searchParams} />;
};

export default page;
