import { Suspense } from "react";
import {
  ButtonLink,
  Skeleton,
  SupportApp,
  SupportFaqs,
  SupportForm,
  SupportGuarantee,
  SupportHero,
  SupportSteps,
  SupportWays,
} from "@/components";
import { authLinks, supportOptions } from "@/constants";
import { toContactDefaults } from "@/lib";
import { getCurrentUser, getSupportApp, getSupportFaqs } from "@/services";

const SignInLink = () => {
  return (
    <ButtonLink href={authLinks.login} variant="inverse" size="sm">
      Sign in or register
    </ButtonLink>
  );
};

const AccountLink = async () => {
  const user = await getCurrentUser();

  if (!user) return <SignInLink />;

  return (
    <ButtonLink href={authLinks.account} variant="inverse" size="sm">
      My account
    </ButtonLink>
  );
};

const FaqContent = async () => {
  return <SupportFaqs faqs={await getSupportFaqs()} />;
};

const ContactContent = async () => {
  return <SupportForm contact={toContactDefaults(await getCurrentUser())} />;
};

const AppContent = async () => {
  return <SupportApp app={await getSupportApp()} />;
};

const SupportScreen = () => {
  return (
    <>
      <SupportHero
        accountLink={
          <Suspense fallback={<SignInLink />}>
            <AccountLink />
          </Suspense>
        }
      />

      <div className="page-sheet px-4 pt-4 pb-4">
        <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-content" />}>
          <FaqContent />
        </Suspense>

        <SupportWays items={supportOptions} />
        <SupportGuarantee />
        <SupportSteps />

        <section id="contact" className="mx-auto mt-4 max-w-content scroll-mt-4 rounded-card bg-surface p-6 shadow-card">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 mb-5 text-ink-soft">Give us the details and add your booking reference if you have one.</p>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <ContactContent />
          </Suspense>
        </section>

        <Suspense fallback={<Skeleton className="mx-auto mt-4 h-90 max-w-content" />}>
          <AppContent />
        </Suspense>
      </div>
    </>
  );
};

export default SupportScreen;
