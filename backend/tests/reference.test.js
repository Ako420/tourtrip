import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateReference } from "../src/utils/reference.js";

const references = Array.from({ length: 5000 }, () => generateReference("SUP"));

describe("generateReference", () => {
  it("is the prefix, a dash and 8 characters", () => {
    assert.match(generateReference("SUP"), /^SUP-.{8}$/);
    assert.match(generateReference("HJ"), /^HJ-.{8}$/);
  });

  it("leaves out characters that are easy to mix up", () => {
    for (const reference of references) {
      assert.doesNotMatch(reference.slice(4), /[01OI]/);
    }
  });

  it("uses only capital letters and digits", () => {
    for (const reference of references) {
      assert.match(reference.slice(4), /^[A-Z0-9]{8}$/);
    }
  });

  it("uses every allowed character", () => {
    const used = new Set(references.flatMap((reference) => [...reference.slice(4)]));

    assert.equal(used.size, 32);
  });

  it("doesn't repeat", () => {
    assert.equal(new Set(references).size, references.length);
  });
});
