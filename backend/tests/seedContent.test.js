import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { seedContent } from "../prisma/seed-content.js";
import { cloudinary } from "../src/config/cloudinary.js";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/content.json", import.meta.url), "utf8"));
const iconsFile = readFileSync(new URL("../../frontend/src/constants/icons.ts", import.meta.url), "utf8");

const KEYS = [
  "app", "attractions", "cars", "flights", "home", "hotels", "legal-privacy", "legal-terms", "packages", "planner",
  "trains",
];

const IMAGE_FIELDS = ["heroImageUrl", "imageUrl", "mapImageUrl"];

// Every value in a block with its field name, however deep it sits.
const getFields = (value, field) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => getFields(item, field));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => getFields(item, key));
  }

  return [{ field, value }];
};

const getBlock = async (key) => {
  const { data } = await prisma.contentBlock.findUnique({ where: { key } });

  return data;
};

const sampleFields = getFields(samples);

let log;

before(() => {
  log = console.log;
  console.log = () => {};
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

beforeEach(resetDatabase);

describe("seedContent", () => {
  it("creates a row for every block", async () => {
    await seedContent();

    const blocks = await prisma.contentBlock.findMany({ orderBy: { key: "asc" } });

    assert.deepEqual(blocks.map(({ key }) => key), KEYS);
  });

  it("stores each block exactly as exported", async () => {
    await seedContent();

    for (const key of KEYS) {
      assert.deepEqual(await getBlock(key), samples[key]);
    }
  });

  it("creates no duplicates when run twice", async () => {
    await seedContent();
    await seedContent();

    assert.equal(await prisma.contentBlock.count(), KEYS.length);
  });

  it("puts a changed block back to the sample", async () => {
    await seedContent();
    await prisma.contentBlock.update({ where: { key: "home" }, data: { data: { changed: true } } });
    await seedContent();

    assert.deepEqual(await getBlock("home"), samples.home);
  });

  it("leaves other blocks alone", async () => {
    await prisma.contentBlock.create({ data: { key: "custom", data: { kept: true } } });
    await seedContent();

    assert.deepEqual(await getBlock("custom"), { kept: true });
  });

  it("uploads nothing during tests", async (t) => {
    const upload = t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "unused" }));

    await seedContent();

    assert.equal(upload.mock.callCount(), 0);
  });
});

describe("content.json", () => {
  it("has every block", () => {
    assert.deepEqual(Object.keys(samples).sort(), KEYS);
  });

  for (const key of ["legal-terms", "legal-privacy"]) {
    it(`keeps ${key} marked as a draft`, () => {
      assert.equal(samples[key].isDraft, true);
    });

    it(`keeps the gaps for a lawyer in ${key}`, () => {
      const text = getFields(samples[key]).map(({ value }) => value).join(" ");

      assert.match(text, /\[[^\]]+\]/);
    });
  }

  it("uses only icons the frontend has", () => {
    const names = sampleFields.filter(({ field }) => field === "iconName").map(({ value }) => value);

    assert.ok(names.length > 0);

    for (const name of new Set(names)) {
      assert.match(iconsFile, new RegExp(`^\\s*"?${name}"?\\s*[:,]`, "m"), `${name} isn't in icons.ts`);
    }
  });

  it("has a web address in every image field", () => {
    const images = sampleFields.filter(({ field }) => IMAGE_FIELDS.includes(field));

    assert.ok(images.length > 0);

    for (const { field, value } of images) {
      assert.match(value, /^https:\/\//, `${field} has no address`);
    }
  });
});
