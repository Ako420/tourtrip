import { FlightBookingScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/flights/book">) => {
  return <FlightBookingScreen searchParams={searchParams} />;
};

export default page;
