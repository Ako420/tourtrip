import { BookingScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/hotels/[slug]/book">) => {
  return <BookingScreen params={params} searchParams={searchParams} />;
};

export default page;
