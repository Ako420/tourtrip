import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const FAILED_LOGINS_ALLOWED = 10;
const PASSWORD = "secret123";

// The limiter remembers attempts by email between tests, so each test uses its own address.
const createUser = async (email) => {
  const passwordHash = await bcrypt.hash(PASSWORD, 4);

  return prisma.user.create({ data: { fullName: "Ada Obi", email, passwordHash } });
};

const login = (email, password = PASSWORD) => api.post("/api/auth/login").send({ email, password });

const failLogins = async (email, count) => {
  for (let attempt = 0; attempt < count; attempt += 1) {
    const response = await login(email, "wrong-password");

    assert.equal(response.status, 401);
  }
};

beforeEach(resetDatabase);
after(closeDatabase);

describe("POST /api/auth/login", () => {
  it("returns only a 7 day token for the right password", async () => {
    const user = await createUser("right@example.com");
    const response = await login("right@example.com");
    const payload = jwt.verify(response.body.token, env.JWT_SECRET);

    assert.equal(response.status, 200);
    assert.deepEqual(Object.keys(response.body), ["token"]);
    assert.equal(payload.sub, user.id);
    assert.equal(payload.role, "USER");
    assert.equal(payload.exp - payload.iat, SEVEN_DAYS);
  });

  it("includes the user's role in the token", async () => {
    const user = await createUser("admin@example.com");

    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });

    const response = await login("admin@example.com");

    assert.equal(jwt.verify(response.body.token, env.JWT_SECRET).role, "ADMIN");
  });

  it("finds the account with any letter case and spacing in the email", async () => {
    await createUser("case@example.com");

    const response = await login("  CASE@Example.com ");

    assert.equal(response.status, 200);
  });

  it("rejects a wrong password", async () => {
    await createUser("wrong@example.com");

    const response = await login("wrong@example.com", "wrong-password");

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { message: "Incorrect email or password", code: "INVALID_CREDENTIALS" });
  });

  it("gives an unknown email the same response as a wrong password", async () => {
    const response = await login("nobody@example.com");

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { message: "Incorrect email or password", code: "INVALID_CREDENTIALS" });
  });

  it("still runs a cost 12 password check for an unknown email", async (t) => {
    const compare = t.mock.method(bcrypt, "compare");

    await login("timing@example.com");

    assert.equal(compare.mock.callCount(), 1);
    assert.equal(compare.mock.calls[0].arguments[1].slice(0, 7), "$2b$12$");
  });

  it("doesn't apply the signup password rules to login", async () => {
    const response = await login("short@example.com", "x");

    assert.equal(response.status, 401);
  });

  const invalidBodies = {
    "a missing email": [{ password: PASSWORD }, "email"],
    "an invalid email": [{ email: "not-an-email", password: PASSWORD }, "email"],
    "a missing password": [{ email: "ada@example.com" }, "password"],
    "an empty password": [{ email: "ada@example.com", password: "" }, "password"],
  };

  for (const [problem, [body, path]] of Object.entries(invalidBodies)) {
    it(`rejects ${problem}`, async () => {
      const response = await api.post("/api/auth/login").send(body);

      assert.equal(response.status, 400);
      assert.equal(response.body.errors[0].path, path);
    });
  }
});

describe("login rate limit", () => {
  it("blocks the attempt after 10 failures, even with the right password", async () => {
    await createUser("limit@example.com");
    await failLogins("limit@example.com", FAILED_LOGINS_ALLOWED);

    const response = await login("limit@example.com");

    assert.equal(response.status, 429);
    assert.deepEqual(response.body, {
      message: "Too many failed attempts. Try again later.",
      code: "TOO_MANY_ATTEMPTS",
    });
    assert.ok(Number(response.headers["retry-after"]) > 0);
  });

  it("allows the 10th failed attempt", async () => {
    await createUser("tenth@example.com");
    await failLogins("tenth@example.com", FAILED_LOGINS_ALLOWED - 1);

    const response = await login("tenth@example.com", "wrong-password");

    assert.equal(response.status, 401);
  });

  it("counts an email the same in any letter case", async () => {
    await createUser("mixed@example.com");
    await failLogins("mixed@example.com", FAILED_LOGINS_ALLOWED / 2);
    await failLogins("MIXED@example.com", FAILED_LOGINS_ALLOWED / 2);

    const response = await login(" Mixed@Example.com ");

    assert.equal(response.status, 429);
  });

  it("limits unknown emails too", async () => {
    await failLogins("ghost@example.com", FAILED_LOGINS_ALLOWED);

    const response = await login("ghost@example.com");

    assert.equal(response.status, 429);
  });

  it("doesn't count successful logins", async () => {
    await createUser("regular@example.com");

    for (let attempt = 0; attempt <= FAILED_LOGINS_ALLOWED; attempt += 1) {
      const response = await login("regular@example.com");

      assert.equal(response.status, 200);
    }
  });

  it("doesn't count requests that fail validation", async () => {
    await createUser("invalid@example.com");

    for (let attempt = 0; attempt <= FAILED_LOGINS_ALLOWED; attempt += 1) {
      const response = await api.post("/api/auth/login").send({ email: "invalid@example.com" });

      assert.equal(response.status, 400);
    }

    const response = await login("invalid@example.com");

    assert.equal(response.status, 200);
  });

  it("keeps each email's count separate", async () => {
    await createUser("blocked@example.com");
    await createUser("other@example.com");
    await failLogins("blocked@example.com", FAILED_LOGINS_ALLOWED);

    const response = await login("other@example.com");

    assert.equal(response.status, 200);
  });
});
