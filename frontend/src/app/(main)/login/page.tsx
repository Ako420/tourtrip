import { LoginScreen } from "@/screens";

const page = ({ searchParams }: PageProps<"/login">) => {
  return <LoginScreen searchParams={searchParams} />;
};

export default page;
