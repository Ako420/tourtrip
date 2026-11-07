import { InspirationScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/inspiration">) => {
  return <InspirationScreen searchParams={searchParams} />;
};

export default page;
