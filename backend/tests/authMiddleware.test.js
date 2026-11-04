import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { prisma } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { optionalAuth, requireAdmin, requireAuth } from "../src/middlewares/auth.js";
import { signToken } from "../src/utils/token.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const showUser = (req, res) => res.json({ user: req.user ?? null });

const app = express();

app.get("/optional", optionalAuth, showUser);
app.get("/required", requireAuth, showUser);
app.get("/admin", requireAuth, requireAdmin, showUser);
app.use(errorHandler);

const testApi = request(app);

const createUser = (overrides = {}) => {
  return prisma.user.create({
    data: { fullName: "Ada Obi", email: "ada@example.com", passwordHash: "x", ...overrides },
  });
};

const bearer = (token) => `Bearer ${token}`;

const expiredToken = ({ id, role }) => {
  return jwt.sign({ role }, env.JWT_SECRET, { subject: id, expiresIn: -10 });
};

const badTokens = {
  "an expired token": (user) => bearer(expiredToken(user)),
  "a token signed with another secret": ({ id, role }) => {
    return bearer(jwt.sign({ role }, "another-secret-".repeat(4), { subject: id }));
  },
  "a token with no signature": ({ id }) => {
    return bearer(jwt.sign({ role: "ADMIN" }, null, { subject: id, algorithm: "none" }));
  },
  "a token signed with another algorithm": ({ id, role }) => {
    return bearer(jwt.sign({ role }, env.JWT_SECRET, { subject: id, algorithm: "HS512" }));
  },
  "a changed token": (user) => {
    const [header, , signature] = signToken(user).split(".");
    const payload = Buffer.from(JSON.stringify({ sub: user.id, role: "ADMIN" })).toString("base64url");

    return bearer(`${header}.${payload}.${signature}`);
  },
  "text that isn't a token": () => bearer("not-a-token"),
  "another auth scheme": (user) => `Basic ${signToken(user)}`,
  "a scheme with no token": () => "Bearer",
};

beforeEach(resetDatabase);
after(closeDatabase);

describe("requireAuth", () => {
  it("sets req.user from a valid token", async () => {
    const user = await createUser();
    const response = await testApi.get("/required").set("Authorization", bearer(signToken(user)));

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { user: { id: user.id, role: "USER" } });
  });

  it("accepts the scheme in any letter case", async () => {
    const user = await createUser();
    const response = await testApi.get("/required").set("Authorization", `bearer ${signToken(user)}`);

    assert.equal(response.status, 200);
  });

  it("rejects a request with no token", async () => {
    const response = await testApi.get("/required");

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { message: "Log in to continue", code: "AUTH_REQUIRED" });
  });

  for (const [name, getHeader] of Object.entries(badTokens)) {
    it(`rejects ${name}`, async () => {
      const user = await createUser();
      const response = await testApi.get("/required").set("Authorization", getHeader(user));

      assert.equal(response.status, 401);
      assert.deepEqual(response.body, {
        message: "Your session has expired. Log in again.",
        code: "INVALID_TOKEN",
      });
    });
  }
});

describe("optionalAuth", () => {
  it("continues as a guest with no token", async () => {
    const response = await testApi.get("/optional");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { user: null });
  });

  it("sets req.user from a valid token", async () => {
    const user = await createUser();
    const response = await testApi.get("/optional").set("Authorization", bearer(signToken(user)));

    assert.deepEqual(response.body, { user: { id: user.id, role: "USER" } });
  });

  for (const [name, getHeader] of Object.entries(badTokens)) {
    it(`rejects ${name} rather than continuing as a guest`, async () => {
      const user = await createUser();
      const response = await testApi.get("/optional").set("Authorization", getHeader(user));

      assert.equal(response.status, 401);
      assert.equal(response.body.code, "INVALID_TOKEN");
    });
  }
});

describe("requireAdmin", () => {
  it("lets an admin through", async () => {
    const admin = await createUser({ role: "ADMIN" });
    const response = await testApi.get("/admin").set("Authorization", bearer(signToken(admin)));

    assert.equal(response.status, 200);
  });

  it("rejects a normal user", async () => {
    const user = await createUser();
    const response = await testApi.get("/admin").set("Authorization", bearer(signToken(user)));

    assert.equal(response.status, 403);
    assert.deepEqual(response.body, { message: "You don't have access to this", code: "FORBIDDEN" });
  });

  it("rejects a request with no token", async () => {
    const response = await testApi.get("/admin");

    assert.equal(response.status, 401);
  });

  it("rejects a demoted admin whose token still says ADMIN", async () => {
    const admin = await createUser({ role: "ADMIN" });
    const token = signToken(admin);

    await prisma.user.update({ where: { id: admin.id }, data: { role: "USER" } });

    const response = await testApi.get("/admin").set("Authorization", bearer(token));

    assert.equal(response.status, 403);
  });

  it("lets a promoted user in before their token is renewed", async () => {
    const user = await createUser();
    const token = signToken(user);

    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });

    const response = await testApi.get("/admin").set("Authorization", bearer(token));

    assert.equal(response.status, 200);
  });

  it("rejects a token for a deleted account", async () => {
    const admin = await createUser({ role: "ADMIN" });
    const token = signToken(admin);

    await prisma.user.delete({ where: { id: admin.id } });

    const response = await testApi.get("/admin").set("Authorization", bearer(token));

    assert.equal(response.status, 401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current user without private fields", async () => {
    const user = await createUser({ phone: "+234 800 000 0000", avatarUrl: "https://example.com/ada.jpg" });
    const response = await api.get("/api/auth/me").set("Authorization", bearer(signToken(user)));

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      id: user.id,
      fullName: "Ada Obi",
      email: "ada@example.com",
      phone: "+234 800 000 0000",
      avatarUrl: "https://example.com/ada.jpg",
      role: "USER",
    });
  });

  it("works with the token from signup", async () => {
    const { body } = await api
      .post("/api/auth/signup")
      .send({ fullName: "Ada Obi", email: "new@example.com", password: "secret123" });
    const response = await api.get("/api/auth/me").set("Authorization", bearer(body.token));

    assert.equal(response.status, 200);
    assert.equal(response.body.email, "new@example.com");
    assert.equal(response.body.phone, null);
  });

  it("works with the token from login", async () => {
    await api
      .post("/api/auth/signup")
      .send({ fullName: "Ada Obi", email: "back@example.com", password: "secret123" });

    const { body } = await api
      .post("/api/auth/login")
      .send({ email: "back@example.com", password: "secret123" });
    const response = await api.get("/api/auth/me").set("Authorization", bearer(body.token));

    assert.equal(response.status, 200);
    assert.equal(response.body.email, "back@example.com");
  });

  it("rejects a request with no token", async () => {
    const response = await api.get("/api/auth/me");

    assert.equal(response.status, 401);
    assert.equal(response.body.code, "AUTH_REQUIRED");
  });

  it("rejects an expired token", async () => {
    const user = await createUser();
    const response = await api.get("/api/auth/me").set("Authorization", bearer(expiredToken(user)));

    assert.equal(response.status, 401);
    assert.equal(response.body.code, "INVALID_TOKEN");
  });

  it("rejects a token for a deleted account", async () => {
    const user = await createUser();
    const token = signToken(user);

    await prisma.user.delete({ where: { id: user.id } });

    const response = await api.get("/api/auth/me").set("Authorization", bearer(token));

    assert.equal(response.status, 401);
    assert.equal(response.body.code, "INVALID_TOKEN");
  });
});
