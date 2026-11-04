import Link from "next/link";
import type { LegalDocument } from "@/types";
import Icon from "../ui/Icon";
import LegalText from "./LegalText";

type LegalPageProps = {
  document: LegalDocument;
};

const otherPage = {
  terms: { label: "Privacy statement", href: "/privacy" },
  privacy: { label: "Booking terms", href: "/terms" },
};

const LegalPage = ({ document }: LegalPageProps) => {
  const other = otherPage[document.slug];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <nav aria-label="On this page" className="rounded-card border border-line p-4 text-sm lg:sticky lg:top-24">
        <h2 className="mb-2 font-semibold">On this page</h2>
        <ol className="flex flex-col gap-1.5">
          {document.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-ink-soft transition-colors duration-300 ease-out hover:text-primary">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
        <Link href={other.href} className="mt-4 block border-t border-line pt-3 font-medium text-primary hover:underline">
          {other.label}
        </Link>
      </nav>

      <article className="min-w-0 max-w-3xl">
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <p className="mt-1 text-ink-soft">{document.summary}</p>
        <p className="mt-1 text-sm text-muted">Last updated {document.updatedOn}</p>

        {document.isDraft && (
          <p role="note" className="mt-4 flex items-start gap-3 rounded-md bg-accent-soft p-3 text-sm">
            <Icon name="error" className="mt-0.5 text-accent" />
            <span>
              <strong className="block">Draft for review</strong>
              This is a template and not legal advice. It needs a lawyer&apos;s review, and the highlighted details must
              be filled in before launch.
            </span>
          </p>
        )}

        {document.sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mt-8 scroll-mt-24">
            <h2 className="text-xl font-bold">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-2 leading-relaxed text-ink-soft">
                <LegalText text={paragraph} />
              </p>
            ))}
            {section.items && (
              <ul className="mt-2 list-disc pl-5 leading-relaxed text-ink-soft">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </div>
  );
};

export default LegalPage;
