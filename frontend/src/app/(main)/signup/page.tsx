import { SignupScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/signup">) => {
  return <SignupScreen searchParams={searchParams} />;
};

export default page;
