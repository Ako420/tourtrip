import { AppShell, ButtonLink, StatusMessage } from "@/components";

const NotFoundScreen = () => {
  return (
    <AppShell>
      <StatusMessage
        iconName="compass"
        title="Page not available yet"
        description="This page does not exist or has not been built yet."
      >
        <ButtonLink href="/">Back to home</ButtonLink>
      </StatusMessage>
    </AppShell>
  );
};

export default NotFoundScreen;
