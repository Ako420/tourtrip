import { PackageBookingConfirmedScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/packages/book/confirmed">) => {
  return <PackageBookingConfirmedScreen searchParams={searchParams} />;
};

export default page;
