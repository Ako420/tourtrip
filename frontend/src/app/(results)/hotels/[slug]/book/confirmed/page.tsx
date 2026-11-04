import { BookingConfirmedScreen } from "@/screens";

const page = ({ params, searchParams }: PageProps<"/hotels/[slug]/book/confirmed">) => {
  return <BookingConfirmedScreen params={params} searchParams={searchParams} />;
};

export default page;
