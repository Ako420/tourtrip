import { randomInt } from "node:crypto";

// 0, O, 1 and I are left out, because they're easy to mix up when read aloud.
const CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LENGTH = 8;

export const generateReference = (prefix) => {
  const characters = Array.from({ length: LENGTH }, () => CHARACTERS[randomInt(CHARACTERS.length)]);

  return `${prefix}-${characters.join("")}`;
};
