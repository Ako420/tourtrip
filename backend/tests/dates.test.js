import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, formatDuration } from "../src/utils/dates.js";

describe("addDays", () => {
  const dates = {
    "moves forward": ["2026-12-10", 3, "2026-12-13"],
    "moves back": ["2026-12-10", -3, "2026-12-07"],
    "stays put": ["2026-12-10", 0, "2026-12-10"],
    "crosses a month": ["2026-12-30", 3, "2027-01-02"],
    "crosses a month going back": ["2027-01-02", -3, "2026-12-30"],
    "knows a leap year": ["2028-02-28", 1, "2028-02-29"],
    "knows an ordinary year": ["2027-02-28", 1, "2027-03-01"],
  };

  for (const [name, [date, days, expected]] of Object.entries(dates)) {
    it(name, () => {
      assert.equal(addDays(date, days), expected);
    });
  }
});

describe("formatDuration", () => {
  const durations = { 380: "6h 20m", 360: "6h", 45: "0h 45m", 60: "1h", 61: "1h 1m", 1505: "25h 5m" };

  for (const [minutes, expected] of Object.entries(durations)) {
    it(`shows ${minutes} minutes as ${expected}`, () => {
      assert.equal(formatDuration(Number(minutes)), expected);
    });
  }
});
