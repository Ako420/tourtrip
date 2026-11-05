import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { signToken } from "../src/utils/token.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const REFERENCE = /^SUP-[A-HJ-NP-Z2-9]{8}$/;
const MESSAGE = "I need to change the name on my booking, please.";

let emailCount = 0;

// The rate limit counts per email for the whole file, so each test gets its own address.
const nextEmail = () => {
  emailCount += 1;

  return `guest${emailCount}@example.com`;
};

const toTicket = (changes = {}) => {
  return { fullName: "Ada Obi", email: nextEmail(), topic: "booking", message: MESSAGE, ...changes };
};

const send = (ticket) => api.post("/api/support/tickets").send(ticket);

const findTicket = ({ body }) => prisma.supportTicket.findUnique({ where: { reference: body.reference } });

after(closeDatabase);

beforeEach(async () => {
  await resetDatabase();
});

describe("POST /api/support/tickets as a guest", () => {
  it("returns 201 with only the reference", async () => {
    const response = await send(toTicket());

    assert.equal(response.status, 201);
    assert.deepEqual(Object.keys(response.body), ["reference"]);
    assert.match(response.body.reference, REFERENCE);
  });

  it("stores the ticket as open and with no user", async () => {
    const response = await send(toTicket({ email: "ada@example.com", bookingReference: "HJ-7K2M9QXA" }));
    const ticket = await findTicket(response);

    assert.equal(ticket.fullName, "Ada Obi");
    assert.equal(ticket.email, "ada@example.com");
    assert.equal(ticket.topic, "booking");
    assert.equal(ticket.bookingReference, "HJ-7K2M9QXA");
    assert.equal(ticket.message, MESSAGE);
    assert.equal(ticket.status, "OPEN");
    assert.equal(ticket.userId, null);
  });

  it("tidies what it stores", async () => {
    const response = await send(toTicket({
      fullName: "  Ada Obi  ",
      email: "  ADA@Example.COM ",
      bookingReference: " hj-7k2m9qxa ",
      message: `  ${MESSAGE}  `,
    }));
    const ticket = await findTicket(response);

    assert.equal(ticket.fullName, "Ada Obi");
    assert.equal(ticket.email, "ada@example.com");
    assert.equal(ticket.bookingReference, "HJ-7K2M9QXA");
    assert.equal(ticket.message, MESSAGE);
  });

  for (const topic of ["booking", "change", "payment", "account", "other"]) {
    it(`accepts the ${topic} topic`, async () => {
      const response = await send(toTicket({ topic }));

      assert.equal(response.status, 201);
    });
  }

  it("gives each ticket its own reference", async () => {
    const first = await send(toTicket());
    const second = await send(toTicket());

    assert.notEqual(first.body.reference, second.body.reference);
  });

  it("ignores fields a guest shouldn't set", async () => {
    const { id } = await prisma.user.create({
      data: { fullName: "Someone Else", email: "else@example.com", passwordHash: "unused" },
    });
    const response = await send(toTicket({ id: "chosen", userId: id, status: "CLOSED", reference: "SUP-CHOSEN12" }));
    const ticket = await findTicket(response);

    assert.notEqual(ticket.id, "chosen");
    assert.notEqual(ticket.reference, "SUP-CHOSEN12");
    assert.equal(ticket.userId, null);
    assert.equal(ticket.status, "OPEN");
  });
});

describe("POST /api/support/tickets when signed in", () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: { fullName: "Ada Obi", email: "ada@example.com", passwordHash: "unused" },
    });
    token = signToken(user);
  });

  it("links the ticket to the account", async () => {
    const response = await send(toTicket()).set("Authorization", `Bearer ${token}`);
    const ticket = await findTicket(response);

    assert.equal(response.status, 201);
    assert.equal(ticket.userId, user.id);
  });

  it("keeps the email from the form", async () => {
    const email = nextEmail();
    const response = await send(toTicket({ email })).set("Authorization", `Bearer ${token}`);
    const ticket = await findTicket(response);

    assert.equal(ticket.email, email);
  });

  it("rejects a bad token and stores nothing", async () => {
    const response = await send(toTicket()).set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 401);
    assert.equal(response.body.code, "INVALID_TOKEN");
    assert.equal(await prisma.supportTicket.count(), 0);
  });
});

describe("POST /api/support/tickets booking reference", () => {
  const empty = { "an empty reference": "", "only spaces": "   ", "no reference": undefined };

  for (const [name, bookingReference] of Object.entries(empty)) {
    it(`stores ${name} as null`, async () => {
      const response = await send(toTicket({ bookingReference }));
      const ticket = await findTicket(response);

      assert.equal(response.status, 201);
      assert.equal(ticket.bookingReference, null);
    });
  }

  for (const bookingReference of ["ABCDE", "A".repeat(20), "HJ-7K2M9QXA"]) {
    it(`accepts ${bookingReference}`, async () => {
      const response = await send(toTicket({ bookingReference }));

      assert.equal(response.status, 201);
    });
  }
});

describe("POST /api/support/tickets validation", () => {
  const rejected = {
    fullName: ["A", "  A  ", "x".repeat(101), undefined, 12],
    email: ["not-an-email", "", undefined, 12],
    topic: ["refund", "", undefined, 12],
    bookingReference: ["ABCD", "A".repeat(21), "HJ 7K2M", "HJ_7K2M", null, 12],
    message: ["x".repeat(19), `${" ".repeat(30)}short`, "x".repeat(2001), "", undefined, 12],
  };

  for (const [field, values] of Object.entries(rejected)) {
    for (const value of values) {
      it(`rejects ${field} of ${JSON.stringify(value)?.slice(0, 24)}`, async () => {
        const response = await send(toTicket({ [field]: value }));

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.deepEqual(response.body.errors.map(({ path }) => path), [field]);
        assert.equal(await prisma.supportTicket.count(), 0);
      });
    }
  }

  const accepted = {
    "a two-letter name": { fullName: "Al" },
    "a 100-letter name": { fullName: "x".repeat(100) },
    "a 20-character message": { message: "x".repeat(20) },
    "a 2000-character message": { message: "x".repeat(2000) },
  };

  for (const [name, changes] of Object.entries(accepted)) {
    it(`accepts ${name}`, async () => {
      const response = await send(toTicket(changes));

      assert.equal(response.status, 201);
    });
  }

  it("rejects a null byte", async () => {
    const response = await send(toTicket({ message: `${MESSAGE}\u0000` }));

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });
});

describe("POST /api/support/tickets rate limit", () => {
  const LIMIT = 5;

  const sendUpToLimit = async (email) => {
    for (let count = 0; count < LIMIT; count += 1) {
      const response = await send(toTicket({ email }));

      assert.equal(response.status, 201);
    }
  };

  it("allows 5 tickets, then blocks the 6th and stores nothing", async () => {
    const email = nextEmail();

    await sendUpToLimit(email);

    const response = await send(toTicket({ email }));

    assert.equal(response.status, 429);
    assert.deepEqual(response.body, {
      message: "You have sent a lot of messages. Try again later.",
      code: "TOO_MANY_TICKETS",
    });
    assert.equal(await prisma.supportTicket.count(), LIMIT);
  });

  it("resets after an hour", async () => {
    const response = await send(toTicket());

    assert.match(response.headers["ratelimit-policy"], /q=5; w=3600/);
  });

  it("counts each email on its own", async () => {
    await sendUpToLimit(nextEmail());

    const response = await send(toTicket());

    assert.equal(response.status, 201);
  });

  it("treats an email in capitals as the same address", async () => {
    const email = nextEmail();

    await sendUpToLimit(email);

    const response = await send(toTicket({ email: email.toUpperCase() }));

    assert.equal(response.status, 429);
  });

  it("doesn't count a ticket that failed validation", async () => {
    const email = nextEmail();

    for (let count = 0; count < LIMIT + 1; count += 1) {
      await send(toTicket({ email, message: "Too short." }));
    }

    const response = await send(toTicket({ email }));

    assert.equal(response.status, 201);
  });

  it("doesn't count a request with a bad token", async () => {
    const email = nextEmail();

    for (let count = 0; count < LIMIT + 1; count += 1) {
      await send(toTicket({ email })).set("Authorization", "Bearer not-a-real-token");
    }

    const response = await send(toTicket({ email }));

    assert.equal(response.status, 201);
  });

  it("still applies when signed in", async () => {
    const user = await prisma.user.create({
      data: { fullName: "Ada Obi", email: "ada@example.com", passwordHash: "unused" },
    });
    const email = nextEmail();

    await sendUpToLimit(email);

    const response = await send(toTicket({ email })).set("Authorization", `Bearer ${signToken(user)}`);

    assert.equal(response.status, 429);
  });
});
