import { TrainBookingConfirmedScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/trains/book/confirmed">) => {
  return <TrainBookingConfirmedScreen searchParams={searchParams} />;
};

export default page;
