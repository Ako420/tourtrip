import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

process.env.ANTHROPIC_API_KEY = "test-key";

const { default: Anthropic } = await import("@anthropic-ai/sdk");
const { anthropic } = await import("../src/config/anthropic.js");
const { api } = await import("./helpers.js");
const { signToken } = await import("../src/utils/token.js");

const token = signToken({ id: "assistant-test-user", role: "USER" });
const question = { messages: [{ role: "user", content: "When should I visit Tokyo?" }] };

const fakeStream = (texts, stopReason = "end_turn", error) => ({
  async *[Symbol.asyncIterator]() {
    for (const text of texts) {
      yield { type: "content_block_delta", delta: { type: "text_delta", text } };
    }

    if (error) throw error;
  },
  finalMessage: async () => ({ stop_reason: stopReason }),
});

const useStream = (stream) => mock.method(anthropic.beta.messages, "stream", () => stream);

const chat = (body, requestToken = token) => {
  const request = api.post("/api/assistant/chat").send(body);

  return requestToken ? request.set("Authorization", `Bearer ${requestToken}`) : request;
};

const readEvents = ({ text }) => text.trim().split("\n").map((line) => JSON.parse(line));

afterEach(() => mock.restoreAll());

describe("POST /api/assistant/chat", () => {
  it("needs a signed-in user", async () => {
    const response = await chat(question, null);

    assert.equal(response.status, 401);
  });

  it("streams the reply one event per line", async () => {
    useStream(fakeStream(["Spring ", "is lovely."]));

    const response = await chat(question);

    assert.equal(response.status, 200);
    assert.deepEqual(readEvents(response), [
      { type: "text", text: "Spring " },
      { type: "text", text: "is lovely." },
      { type: "done", stopReason: "end_turn" },
    ]);
  });

  it("sends a fixed system prompt and the conversation", async () => {
    const stream = useStream(fakeStream(["Hello"]));

    await chat(question);

    const [params] = stream.mock.calls[0].arguments;

    assert.equal(params.model, "claude-opus-5-5");
    assert.equal(params.fallbacks, "default");
    assert.match(params.system, /Hotel Jr/);
    assert.deepEqual(params.messages, question.messages);
  });

  it("reports a refusal so the page can replace the reply", async () => {
    useStream(fakeStream([], "refusal"));

    const response = await chat(question);

    assert.deepEqual(readEvents(response), [{ type: "done", stopReason: "refusal" }]);
  });

  it("rejects a conversation that does not end with the user", async () => {
    const stream = useStream(fakeStream(["Hello"]));
    const response = await chat({
      messages: [
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello" },
      ],
    });

    assert.equal(response.status, 400);
    assert.equal(stream.mock.callCount(), 0);
  });

  it("rejects a message that is too long", async () => {
    const response = await chat({ messages: [{ role: "user", content: "a".repeat(2001) }] });

    assert.equal(response.status, 400);
  });

  it("returns an error status when the reply fails before it starts", async () => {
    mock.method(console, "error", () => {});
    useStream(fakeStream([], "end_turn", new Error("connection lost")));

    const response = await chat(question);

    assert.equal(response.status, 502);
    assert.equal(response.body.code, "ASSISTANT_UNAVAILABLE");
  });

  it("says the assistant is busy when Claude is rate limited", async () => {
    mock.method(console, "error", () => {});
    useStream(fakeStream([], "end_turn", new Anthropic.RateLimitError(429, undefined, "Too busy", new Headers())));

    const response = await chat(question);

    assert.equal(response.status, 503);
    assert.equal(response.body.code, "ASSISTANT_BUSY");
  });

  it("adds an error line when the reply fails part way", async () => {
    mock.method(console, "error", () => {});
    useStream(fakeStream(["Spring "], "end_turn", new Error("connection lost")));

    const response = await chat(question);

    assert.equal(response.status, 200);
    assert.deepEqual(readEvents(response), [
      { type: "text", text: "Spring " },
      { type: "error", message: "The assistant is not available right now." },
    ]);
  });
});
