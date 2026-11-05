import { readFileSync } from "node:fs";
import { prisma } from "../src/config/db.js";

const SAMPLE_FAQS = new URL("./seed-data/faqs.json", import.meta.url);

export const seedFaqs = async () => {
  const faqs = JSON.parse(readFileSync(SAMPLE_FAQS, "utf8"));

  for (const [index, { id, ...faq }] of faqs.entries()) {
    const data = { ...faq, sortRank: index + 1 };

    await prisma.faq.upsert({ where: { id }, update: data, create: { ...data, id } });
  }

  console.log(`Seeded ${faqs.length} FAQs`);
};
