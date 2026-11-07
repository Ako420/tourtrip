import { isAssistantLive, streamAssistantReply } from "@/services";

const unavailable = () => {
  return Response.json({ message: "The assistant is not available right now." }, { status: 503 });
};

// The browser talks to this route, so the session token and API address stay on the server.
export const POST = async (request: Request) => {
  if (!isAssistantLive()) {
    return unavailable();
  }

  const { messages } = await request.json();

  try {
    const reply = await streamAssistantReply(messages, request.signal);

    return new Response(reply.body, {
      status: reply.status,
      headers: { "Content-Type": reply.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return unavailable();
  }
};
