import { ASSISTANT_MAX_HISTORY } from "@/constants";
import type { AssistantEvent, AssistantMessage } from "@/types";

// The API needs the history to start with the user, so an odd cut drops one more message.
export const toAssistantHistory = (messages: AssistantMessage[]) => {
  const recent = messages.slice(-ASSISTANT_MAX_HISTORY);
  const history = recent[0]?.role === "assistant" ? recent.slice(1) : recent;

  return history.map(({ role, content }) => ({ role, content }));
};

// Each line of the reply is one JSON event, but network chunks can end part way through a line.
export async function* readAssistantEvents(response: Response): AsyncGenerator<AssistantEvent> {
  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  while (reader) {
    const { done, value } = await reader.read();

    if (done) return;

    buffer += value;

    const lines = buffer.split("\n");

    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line) yield JSON.parse(line) as AssistantEvent;
    }
  }
}
