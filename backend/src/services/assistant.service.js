import Anthropic from "@anthropic-ai/sdk";
import { anthropic } from "../config/anthropic.js";
import { HttpError } from "../utils/httpError.js";

const MODEL = "claude-opus-5-5";
const MAX_REPLY_TOKENS = 2048;

const SYSTEM_PROMPT = `You are the travel assistant for Hotel Jr, a travel booking website.

Help people plan trips: where to go, when to go, what to see, how to get around and what to pack. You can also explain what the site offers: hotels, flights, trains, car rentals, attractions, Flight + Hotel packages, private and group tours, cruises, city guides, a trip planner, deals and rewards.

You have no access to Hotel Jr's live prices, availability or anyone's bookings or account, and you cannot book, change or cancel anything. If asked, say so plainly and point people to the site: Find bookings for their trips, Customer support for help with a booking. Never make up a price, a booking detail, a policy or a guarantee.

Politely steer unrelated requests back to travel. Keep replies short and friendly. Write in plain sentences and short paragraphs, without Markdown.`;

export const isAssistantConfigured = () => Boolean(anthropic);

const toHttpError = (error) => {
  if (error instanceof Anthropic.RateLimitError) {
    return new HttpError(503, "The assistant is busy. Try again in a moment.", "ASSISTANT_BUSY");
  }

  return new HttpError(502, "The assistant is not available right now.", "ASSISTANT_UNAVAILABLE");
};

// Yields each piece of text, then the reason the reply stopped.
export async function* streamReply(messages, signal) {
  const stream = anthropic.beta.messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_REPLY_TOKENS,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages,
    },
    { signal },
  );

  try {
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { type: "text", text: event.delta.text };
      }
    }

    const { stop_reason: stopReason } = await stream.finalMessage();

    yield { type: "done", stopReason };
  } catch (error) {
    if (signal.aborted) return;

    console.error(error);
    throw toHttpError(error);
  }
}
