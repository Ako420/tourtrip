import { CarBookingConfirmedScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/cars/book/confirmed">) => {
  return <CarBookingConfirmedScreen searchParams={searchParams} />;
};

export default page;
