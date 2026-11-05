"use client";

import { useState } from "react";
import { supportProducts } from "@/constants";
import type { SupportFaq, SupportProductId } from "@/types";
import FaqList from "../ui/FaqList";
import Icon from "../ui/Icon";
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
        <div className="scrollbar-none mb-4 flex gap-2 overflow-x-auto">
          {supportProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              aria-pressed={product.id === productId}
              onClick={() => setProductId(product.id)}
              className={`flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                product.id === productId ? "border-ink bg-ink text-white" : "border-line hover:border-primary hover:text-primary"
              }`}
            >
              <Icon name={product.iconName} />
              {product.label}
            </button>
          ))}
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
