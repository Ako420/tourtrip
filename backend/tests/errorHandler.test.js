import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import express from "express";
import request from "supertest";
import { z } from "zod";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { notFound } from "../src/middlewares/notFound.js";
import { HttpError } from "../src/utils/httpError.js";

const prismaError = (code) => {
  return new Prisma.PrismaClientKnownRequestError("Prisma failed", { code, clientVersion: "test" });
};

const throwing = (error) => () => {
  throw error;
};

const app = express();

app.use(express.json({ limit: "1kb" }));
app.post("/echo", (req, res) => res.json(req.body));
app.get("/http", throwing(new HttpError(409, "This room has just sold out.", "ROOM_SOLD_OUT")));
app.get("/http-async", async () => {
  throw new HttpError(404, "Hotel not found", "HOTEL_NOT_FOUND");
});
app.get("/http-503", throwing(new HttpError(503, "password=hunter2", "DB_DOWN")));
app.get("/unexpected", throwing(new Error("password=hunter2")));
app.get("/system", throwing(Object.assign(new Error("connect ECONNREFUSED 10.0.0.5"), { code: "ECONNREFUSED" })));
app.get("/duplicate", throwing(prismaError("P2002")));
app.get("/missing", throwing(prismaError("P2025")));
app.get("/zod", () => {
  z.object({
    checkIn: z.string("Enter a valid date"),
    guests: z.object({ adults: z.number("Enter the adults") }),
  }).parse({ guests: {} });
});
app.use(notFound);
app.use(errorHandler);

const api = request(app);

describe("HttpError", () => {
  it("returns its status, message and code", async () => {
    const response = await api.get("/http");

    assert.equal(response.status, 409);
    assert.deepEqual(response.body, { message: "This room has just sold out.", code: "ROOM_SOLD_OUT" });
  });

  it("works when thrown from an async route", async () => {
    const response = await api.get("/http-async");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Hotel not found", code: "HOTEL_NOT_FOUND" });
  });
});

describe("server errors", () => {
  const internalError = { message: "Internal server error", code: "INTERNAL_ERROR" };

  it("hides an unexpected error and logs it", async (t) => {
    const log = t.mock.method(console, "error", () => {});
    const response = await api.get("/unexpected");

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, internalError);
    assert.equal(log.mock.callCount(), 1);
    assert.equal(log.mock.calls[0].arguments[0].message, "password=hunter2");
  });

  it("hides a system error's own code", async (t) => {
    t.mock.method(console, "error", () => {});

    const response = await api.get("/system");

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, internalError);
  });

  it("keeps a 5xx HttpError's status but hides its message and code", async (t) => {
    const log = t.mock.method(console, "error", () => {});
    const response = await api.get("/http-503");

    assert.equal(response.status, 503);
    assert.deepEqual(response.body, internalError);
    assert.equal(log.mock.callCount(), 1);
  });
});

describe("validation and database errors", () => {
  it("turns a ZodError into a 400 with a field list", async () => {
    const response = await api.get("/zod");

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      message: "Check your details and try again",
      code: "VALIDATION_ERROR",
      errors: [
        { path: "checkIn", message: "Enter a valid date" },
        { path: "guests.adults", message: "Enter the adults" },
      ],
    });
  });

  it("turns a duplicate record into a 409", async () => {
    const response = await api.get("/duplicate");

    assert.equal(response.status, 409);
    assert.deepEqual(response.body, { message: "Record already exists", code: "ALREADY_EXISTS" });
  });

  it("turns a missing record into a 404", async () => {
    const response = await api.get("/missing");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Record not found", code: "NOT_FOUND" });
  });
});

describe("request errors", () => {
  it("rejects malformed JSON", async () => {
    const response = await api.post("/echo").set("Content-Type", "application/json").send('{"a":');

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "REQUEST_ERROR");
  });

  it("rejects a body over the limit", async () => {
    const response = await api.post("/echo").send({ pad: "x".repeat(2000) });

    assert.equal(response.status, 413);
    assert.equal(response.body.code, "REQUEST_ERROR");
  });

  it("reports an unknown route", async () => {
    const response = await api.get("/nope");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Route not found: /nope", code: "ROUTE_NOT_FOUND" });
  });

  it("leaves a successful response alone", async () => {
    const response = await api.post("/echo").send({ ok: true });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { ok: true });
  });
});
