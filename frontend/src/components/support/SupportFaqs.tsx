"use client";

import { useState } from "react";
import { supportProducts } from "@/constants";
import type { SupportFaq, SupportProductId } from "@/types";
import Icon from "../ui/Icon";
import PillTabs from "../ui/PillTabs";
import SectionHeading from "../ui/SectionHeading";

type SupportFaqsProps = {
  faqs: SupportFaq[];
};

const tileClass = "rounded-card bg-surface-alt p-4 transition-colors duration-300 ease-out hover:text-primary";

const SupportFaqs = ({ faqs }: SupportFaqsProps) => {
  const [productId, setProductId] = useState<SupportProductId>(supportProducts[0].id);
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();

  // A search covers every product, so a question is found without knowing its tab.
  const visibleFaqs = search
    ? faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(search))
    : faqs.filter((faq) => faq.product === productId);

  return (
    <section className="mx-auto max-w-content rounded-card bg-surface p-4 shadow-card sm:p-6">
      <SectionHeading>How can we help?</SectionHeading>

      <label className="mb-4 flex h-12 items-center gap-3 rounded-md border border-line px-3 transition-colors duration-200 focus-within:border-primary">
        <Icon name="search" className="text-muted" />
        <span className="sr-only">Search help topics</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help topics"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
        />
      </label>

      {!search && (
        <div className="mb-4">
          <PillTabs options={supportProducts} activeId={productId} onChange={setProductId} />
        </div>
      )}

      <div key={search || productId} className="grid items-start gap-2 md:grid-cols-2">
        {visibleFaqs.map((faq) => (
          <details key={faq.id} className={`group ${tileClass}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Icon name="chevron-right" className="text-sm transition-transform duration-300 group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-sm text-ink-soft">{faq.answer}</p>
          </details>
        ))}
        <a href="#contact" className={`flex items-center justify-between gap-4 ${tileClass}`}>
          Have a different question? Send us a message.
          <Icon name="chevron-right" className="text-sm" />
        </a>
      </div>
    </section>
  );
};

export default SupportFaqs;
