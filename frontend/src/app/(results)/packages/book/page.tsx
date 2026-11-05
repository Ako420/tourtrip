import { PackageBookingScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/packages/book">) => {
  return <PackageBookingScreen searchParams={searchParams} />;
};

export default page;
