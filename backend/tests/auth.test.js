import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

const validSignup = { fullName: "Ada Obi", email: "ada@example.com", password: "secret123" };

const signup = (overrides = {}) => api.post("/api/auth/signup").send({ ...validSignup, ...overrides });

beforeEach(resetDatabase);
after(closeDatabase);

describe("POST /api/auth/signup", () => {
  it("creates an account and returns only a token", async () => {
    const response = await signup();

    assert.equal(response.status, 201);
    assert.deepEqual(Object.keys(response.body), ["token"]);
    assert.equal(await prisma.user.count(), 1);
  });

  it("signs a 7 day token for the new user", async () => {
    const response = await signup();
    const user = await prisma.user.findUniqueOrThrow({ where: { email: validSignup.email } });
    const payload = jwt.verify(response.body.token, env.JWT_SECRET);

    assert.equal(payload.sub, user.id);
    assert.equal(payload.role, "USER");
    assert.equal(payload.exp - payload.iat, SEVEN_DAYS);
  });

  it("stores a bcrypt hash at cost 12, not the password", async () => {
    await signup();

    const { passwordHash } = await prisma.user.findUniqueOrThrow({ where: { email: validSignup.email } });

    assert.equal(passwordHash.slice(0, 7), "$2b$12$");
    assert.equal(await bcrypt.compare(validSignup.password, passwordHash), true);
  });

  it("trims the name and email, and lowercases the email", async () => {
    const response = await signup({ fullName: "  Ada Obi  ", email: "  ADA@Example.com  " });
    const user = await prisma.user.findFirstOrThrow();

    assert.equal(response.status, 201);
    assert.equal(user.fullName, "Ada Obi");
    assert.equal(user.email, "ada@example.com");
  });

  it("ignores a role sent in the body", async () => {
    await signup({ role: "ADMIN" });

    const user = await prisma.user.findFirstOrThrow();

    assert.equal(user.role, "USER");
  });

  it("rejects an email that's already used, in any letter case", async () => {
    await signup();

    const response = await signup({ email: "ADA@EXAMPLE.COM" });

    assert.equal(response.status, 409);
    assert.equal(response.body.code, "ALREADY_EXISTS");
    assert.equal(await prisma.user.count(), 1);
  });

  const weakPasswords = {
    "under 8 characters": "abc1234",
    "no letter": "12345678",
    "no number": "abcdefgh",
    "over 72 characters": `a1${"x".repeat(71)}`,
    "over 72 bytes": `a1${"é".repeat(36)}`,
  };

  for (const [problem, password] of Object.entries(weakPasswords)) {
    it(`rejects a password with ${problem}`, async () => {
      const response = await signup({ password });

      assert.equal(response.status, 400);
      assert.equal(response.body.code, "VALIDATION_ERROR");
      assert.equal(response.body.errors[0].path, "password");
      assert.equal(await prisma.user.count(), 0);
    });
  }

  it("accepts a password of exactly 72 bytes", async () => {
    const response = await signup({ password: `a1${"x".repeat(70)}` });

    assert.equal(response.status, 201);
  });

  const invalidFields = {
    "a missing name": { fullName: undefined, path: "fullName" },
    "a name of one letter": { fullName: " A ", path: "fullName" },
    "a name over 100 characters": { fullName: "x".repeat(101), path: "fullName" },
    "a missing email": { email: undefined, path: "email" },
    "an invalid email": { email: "not-an-email", path: "email" },
    "a missing password": { password: undefined, path: "password" },
  };

  for (const [problem, { path, ...overrides }] of Object.entries(invalidFields)) {
    it(`rejects ${problem}`, async () => {
      const response = await signup(overrides);

      assert.equal(response.status, 400);
      assert.equal(response.body.errors[0].path, path);
    });
  }
});
