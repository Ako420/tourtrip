import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase } from "./helpers.js";

after(closeDatabase);

describe("GET /api/health", () => {
  it("reports that the API and database are working", async () => {
    const response = await api.get("/api/health");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: "ok", database: "connected" });
  });

  it("runs against the test database", async () => {
    const [{ current_database: database }] = await prisma.$queryRaw`SELECT current_database()`;

    assert.equal(database, "hotel_jr_test");
  });
});
