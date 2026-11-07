import { AppShell } from "@/components";
import AccountNav from "../account/AccountNav";
import NotFoundContent from "./NotFoundContent";

const NotFoundScreen = () => {
  return (
    <AppShell account={<AccountNav />}>
      <NotFoundContent />
    </AppShell>
  );
};

export default NotFoundScreen;
