import { Suspense } from "react";
import { ButtonLink, LinkCards, Skeleton, SupportFaqs, SupportForm, SupportHero } from "@/components";
import { authLinks, supportOptions } from "@/constants";
import { toContactDefaults } from "@/lib";
import { getCurrentUser, getSupportFaqs } from "@/services";

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

const SupportScreen = () => {
  return (
    <div className="pb-8">
      <SupportHero
        accountLink={
          <Suspense fallback={<SignInLink />}>
            <AccountLink />
          </Suspense>
        }
      />

      <Suspense fallback={<Skeleton className="mx-auto mt-10 h-96 max-w-content" />}>
        <FaqContent />
      </Suspense>

      <LinkCards title="More ways to get help" items={supportOptions} />

      <section id="contact" className="mx-auto mt-10 max-w-content scroll-mt-24">
        <h2 className="text-2xl font-bold sm:text-[1.75rem]">Send us a message</h2>
        <p className="mt-1 mb-5 text-muted">Give us the details and add your booking reference if you have one.</p>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <ContactContent />
        </Suspense>
      </section>
    </div>
  );
};

export default SupportScreen;
