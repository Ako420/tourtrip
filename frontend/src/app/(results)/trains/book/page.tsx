import { TrainBookingScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/trains/book">) => {
  return <TrainBookingScreen searchParams={searchParams} />;
};

export default page;
