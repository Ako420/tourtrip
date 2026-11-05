import { connection } from "next/server";
import { Suspense } from "react";
import { AssistantChat, ButtonLink, Skeleton, StatusMessage } from "@/components";
import { assistantPath, authLinks } from "@/constants";
import { getCurrentUser, isAssistantLive } from "@/services";

const AssistantContent = async () => {
  // Settings are read per request, so a build made with other settings is not baked in.
  await connection();

  if (!isAssistantLive()) {
    return (
      <StatusMessage
        iconName="robot"
        title="The assistant is not connected yet"
        description="In the meantime, our guides and support page can help."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href="/inspiration">Travel guides</ButtonLink>
          <ButtonLink href={authLinks.support} variant="outline">
            Customer support
          </ButtonLink>
        </div>
      </StatusMessage>
    );
  }

  if (!(await getCurrentUser())) {
    return (
      <StatusMessage iconName="robot" title="Sign in to chat" description="The travel assistant is free for Hotel Jr members.">
        <ButtonLink href={`${authLinks.login}?next=${encodeURIComponent(assistantPath)}`}>Sign in</ButtonLink>
      </StatusMessage>
    );
  }

  return <AssistantChat />;
};

const AssistantScreen = () => {
  return (
    <div className="mx-auto max-w-3xl pb-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Travel assistant</h1>
      <p className="mt-1 mb-5 text-sm text-muted">
        Ask for trip ideas and travel tips. It is powered by AI and can make mistakes. It can&apos;t see your bookings or live
        prices, and it can&apos;t book for you.
      </p>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <AssistantContent />
      </Suspense>
    </div>
  );
};

export default AssistantScreen;
