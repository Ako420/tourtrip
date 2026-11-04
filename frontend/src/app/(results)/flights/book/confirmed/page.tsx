import { FlightBookingConfirmedScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/flights/book/confirmed">) => {
  return <FlightBookingConfirmedScreen searchParams={searchParams} />;
};

export default page;
