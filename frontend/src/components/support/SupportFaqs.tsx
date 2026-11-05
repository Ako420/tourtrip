"use client";

import { useState } from "react";
import { supportProducts } from "@/constants";
import type { SupportFaq, SupportProductId } from "@/types";
import FaqList from "../ui/FaqList";
import Icon from "../ui/Icon";
import PillTabs from "../ui/PillTabs";
import SectionHeading from "../ui/SectionHeading";

type SupportFaqsProps = {
  faqs: SupportFaq[];
};

const SupportFaqs = ({ faqs }: SupportFaqsProps) => {
  const [productId, setProductId] = useState<SupportProductId>(supportProducts[0].id);
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();

  // A search covers every product, so a question is found without knowing its tab.
  const visibleFaqs = search
    ? faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(search))
    : faqs.filter((faq) => faq.product === productId);

  return (
    <section className="mx-auto mt-10 max-w-content">
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

      {visibleFaqs.length > 0 ? (
        <FaqList key={search || productId} items={visibleFaqs} />
      ) : (
        <p className="rounded-card border border-line p-5 text-sm text-muted">
          No answers match your search.{" "}
          <a href="#contact" className="font-medium text-primary hover:underline">
            Send us a message
          </a>{" "}
          instead.
        </p>
      )}
    </section>
  );
};

export default SupportFaqs;
