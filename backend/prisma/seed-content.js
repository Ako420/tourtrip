import { readFileSync } from "node:fs";
import { prisma } from "../src/config/db.js";
import { hostImages } from "./seed-images.js";

const SAMPLE_CONTENT = new URL("./seed-data/content.json", import.meta.url);

export const seedContent = async () => {
  const blocks = JSON.parse(readFileSync(SAMPLE_CONTENT, "utf8"));

  for (const [key, block] of Object.entries(blocks)) {
    const data = await hostImages(block, "content");

    await prisma.contentBlock.upsert({ where: { key }, update: { data }, create: { key, data } });
  }

  console.log(`Seeded ${Object.keys(blocks).length} content blocks`);
};
