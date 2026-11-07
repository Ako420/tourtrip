import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import request from "supertest";
import { z } from "zod";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { validate } from "../src/middlewares/validate.js";
import { commaList, isoDate, page, pipeList, queryBoolean } from "../src/utils/validators.js";

const signupSchema = z.object({
  email: z.email("Enter a valid email address"),
  fullName: z.string("Enter your full name").min(2, "Enter your full name"),
});

const searchSchema = z.object({
  checkIn: isoDate.optional(),
  stars: commaList(z.coerce.number("Stars must be a number").int()),
  amenities: commaList(),
  airlines: pipeList(),
  stops: pipeList(z.coerce.number().int()),
  breakfast: queryBoolean,
  page,
});

const echo = (req, res) => res.json(req.validated);

const app = express();

app.use(express.json());
app.post("/signup", validate({ body: signupSchema }), echo);
app.get("/search", validate({ query: searchSchema }), echo);
app.get("/items/:id", validate({ params: z.object({ id: z.coerce.number("Id must be a number").int() }) }), echo);
app.post(
  "/orders/:id",
  validate({ params: z.object({ id: z.string() }), body: z.object({ total: z.number("Enter the total") }) }),
  async (req, res) => res.json(req.validated),
);
app.use(errorHandler);

const api = request(app);

const search = async (query) => {
  const response = await api.get(`/search?${query}`);

  return { status: response.status, data: response.body.query, errors: response.body.errors };
};

describe("null bytes", () => {
  const assertRejected = (response) => {
    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  };

  it("rejects one in a body field", async () => {
    assertRejected(await api.post("/signup").send({ email: "guest@example.com", fullName: "Gue\0st" }));
  });

  it("rejects one in a list", async () => {
    assertRejected(await api.get("/search?amenities=pool,sp%00a"));
  });

  it("ignores one in a field the schema doesn't use", async () => {
    const response = await api.get("/search?unknown=%00");

    assert.equal(response.status, 200);
  });

  it("allows the text \\0", async () => {
    const response = await api.post("/signup").send({ email: "guest@example.com", fullName: "Guest \\0" });

    assert.equal(response.status, 200);
  });
});

describe("validate", () => {
  it("passes a valid body on to the route", async () => {
    const response = await api.post("/signup").send({ email: "ada@example.com", fullName: "Ada" });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { body: { email: "ada@example.com", fullName: "Ada" } });
  });

  it("returns a 400 listing every invalid field", async () => {
    const response = await api.post("/signup").send({ email: "nope", fullName: "A" });

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
    assert.deepEqual(response.body.errors, [
      { path: "email", message: "Enter a valid email address" },
      { path: "fullName", message: "Enter your full name" },
    ]);
  });

  it("names each missing field when no body is sent", async () => {
    const response = await api.post("/signup");

    assert.equal(response.status, 400);
    assert.deepEqual(
      response.body.errors.map(({ path }) => path),
      ["email", "fullName"],
    );
  });

  it("drops fields the schema doesn't list", async () => {
    const response = await api.post("/signup").send({ email: "ada@example.com", fullName: "Ada", role: "ADMIN" });

    assert.equal(response.status, 200);
    assert.deepEqual(Object.keys(response.body.body), ["email", "fullName"]);
  });

  it("validates params", async () => {
    const valid = await api.get("/items/7");
    const invalid = await api.get("/items/abc");

    assert.deepEqual(valid.body, { params: { id: 7 } });
    assert.equal(invalid.status, 400);
    assert.deepEqual(invalid.body.errors, [{ path: "id", message: "Id must be a number" }]);
  });

  it("validates two parts for an async route", async () => {
    const response = await api.post("/orders/abc").send({ total: 10 });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { params: { id: "abc" }, body: { total: 10 } });
  });
});

describe("query defaults", () => {
  it("fills in empty lists, false and page 1", async () => {
    const { status, data } = await search("");

    assert.equal(status, 200);
    assert.deepEqual(data, { stars: [], amenities: [], airlines: [], stops: [], breakfast: false, page: 1 });
  });
});

describe("isoDate", () => {
  it("accepts a real date", async () => {
    const { status, data } = await search("checkIn=2026-12-10");

    assert.equal(status, 200);
    assert.equal(data.checkIn, "2026-12-10");
  });

  for (const value of ["2026-02-30", "2026-13-01", "12/10/2026"]) {
    it(`rejects ${value}`, async () => {
      const { status, errors } = await search(`checkIn=${value}`);

      assert.equal(status, 400);
      assert.deepEqual(errors, [{ path: "checkIn", message: "Enter a valid date" }]);
    });
  }
});

describe("queryBoolean", () => {
  it("reads true", async () => {
    assert.equal((await search("breakfast=true")).data.breakfast, true);
  });

  it("reads the text false as false", async () => {
    assert.equal((await search("breakfast=false")).data.breakfast, false);
  });

  it("rejects anything else", async () => {
    const { status, errors } = await search("breakfast=yes");

    assert.equal(status, 400);
    assert.deepEqual(errors, [{ path: "breakfast", message: "Must be true or false" }]);
  });
});

describe("commaList", () => {
  it("converts items with the given schema", async () => {
    assert.deepEqual((await search("stars=5,4")).data.stars, [5, 4]);
  });

  it("names the invalid item", async () => {
    const { status, errors } = await search("stars=5,x");

    assert.equal(status, 400);
    assert.deepEqual(errors, [{ path: "stars.1", message: "Stars must be a number" }]);
  });

  it("ignores stray commas", async () => {
    assert.deepEqual((await search("amenities=wifi,,pool,")).data.amenities, ["wifi", "pool"]);
  });

  it("rejects a repeated param", async () => {
    const { status, errors } = await search("stars=5&stars=4");

    assert.equal(status, 400);
    assert.equal(errors[0].path, "stars");
  });
});

describe("pipeList", () => {
  it("keeps commas inside a value", async () => {
    const { data } = await search(`airlines=${encodeURIComponent("Sky, Bridge|Savanna Air")}`);

    assert.deepEqual(data.airlines, ["Sky, Bridge", "Savanna Air"]);
  });

  it("converts items with the given schema", async () => {
    assert.deepEqual((await search(`stops=${encodeURIComponent("0|2")}`)).data.stops, [0, 2]);
  });
});

describe("page", () => {
  it("reads a page number", async () => {
    assert.equal((await search("page=3")).data.page, 3);
  });

  for (const query of ["page=0", "page=-1", "page=1.5", "page=abc", "page=1&page=2"]) {
    it(`rejects ${query}`, async () => {
      const { status, errors } = await search(query);

      assert.equal(status, 400);
      assert.equal(errors[0].path, "page");
    });
  }
});
