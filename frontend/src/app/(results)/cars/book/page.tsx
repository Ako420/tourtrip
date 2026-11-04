import { CarBookingScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/cars/book">) => {
  return <CarBookingScreen searchParams={searchParams} />;
};

export default page;
