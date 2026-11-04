"use client";

import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import StatusMessage from "@/components/ui/StatusMessage";

type ErrorScreenProps = {
  retry: () => void;
};

const ErrorScreen = ({ retry }: ErrorScreenProps) => {
  return (
    <AppShell>
      <StatusMessage
        iconName="info"
        title="Something went wrong"
        description="We could not load this page. Please try again."
      >
        <Button onClick={retry}>Try again</Button>
      </StatusMessage>
    </AppShell>
  );
};

export default ErrorScreen;
