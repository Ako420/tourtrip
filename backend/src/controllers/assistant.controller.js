import { isAssistantConfigured, streamReply } from "../services/assistant.service.js";

const NOT_CONFIGURED = { status: 503, message: "The assistant is not connected yet.", code: "ASSISTANT_NOT_CONFIGURED" };

const writeLine = (res, event) => res.write(`${JSON.stringify(event)}\n`);

// The shared error handler hides every 5xx message, but the page needs to show these.
const sendError = (res, { status, message, code }) => res.status(status).json({ message, code });

// Replies stream as one JSON object per line, so the page can show them as they arrive.
export const chat = async (req, res) => {
  if (!isAssistantConfigured()) {
    return sendError(res, NOT_CONFIGURED);
  }

  const controller = new AbortController();

  // Stop paying for a reply nobody is reading.
  res.on("close", () => controller.abort());

  try {
    for await (const event of streamReply(req.validated.body.messages, controller.signal)) {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/x-ndjson");
        res.setHeader("Cache-Control", "no-store");
      }

      writeLine(res, event);
    }

    res.end();
  } catch (error) {
    if (!res.headersSent) return sendError(res, error);

    // Once the reply has started, the status code can no longer change.
    writeLine(res, { type: "error", message: error.message });
    res.end();
  }
};
