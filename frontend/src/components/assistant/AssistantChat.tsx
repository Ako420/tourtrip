"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type SubmitEvent } from "react";
import { ASSISTANT_MAX_MESSAGE_LENGTH, assistantSuggestions } from "@/constants";
import { readAssistantEvents, toAssistantHistory } from "@/lib";
import { assistantMessageSchema } from "@/schemas";
import type { AssistantMessage } from "@/types";
import FormMessage from "../auth/FormMessage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

const REFUSAL_MESSAGE = "Sorry, I can't help with that. Ask me anything about your trip.";
const CUT_SHORT_NOTE = "\n\n(This reply was cut short. Ask me to continue.)";
const FAILED_MESSAGE = "The assistant is not available right now.";

const readError = async (response: Response) => {
  const body = await response.json().catch(() => null);

  return typeof body?.message === "string" ? body.message : FAILED_MESSAGE;
};

const AssistantChat = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const [isReplying, setIsReplying] = useState(false);
  const abortRef = useRef<AbortController>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateReply = (id: string, update: (content: string) => string) => {
    setMessages((current) => {
      return current.map((message) => (message.id === id ? { ...message, content: update(message.content) } : message));
    });
  };

  // Without a reply the question is removed too, because the API needs turns to alternate.
  const undoQuestion = (questionId: string, replyId: string, text: string) => {
    setMessages((current) => current.filter(({ id }) => id !== questionId && id !== replyId));
    setDraft(text);
  };

  const send = async (value: string) => {
    const parsed = assistantMessageSchema.safeParse(value);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    const question: AssistantMessage = { id: crypto.randomUUID(), role: "user", content: parsed.data };
    const replyId = crypto.randomUUID();
    const controller = new AbortController();
    let reply = "";

    abortRef.current = controller;
    setMessages((current) => [...current, question, { id: replyId, role: "assistant", content: "" }]);
    setDraft("");
    setError(undefined);
    setIsReplying(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toAssistantHistory([...messages, question]) }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      for await (const event of readAssistantEvents(response)) {
        if (event.type === "error") throw new Error(event.message);

        if (event.type === "text") {
          reply += event.text;
          updateReply(replyId, () => reply);
        } else if (event.stopReason === "refusal") {
          reply = REFUSAL_MESSAGE;
          updateReply(replyId, () => reply);
        } else if (event.stopReason === "max_tokens") {
          updateReply(replyId, (content) => content + CUT_SHORT_NOTE);
        }
      }
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(caught instanceof TypeError ? FAILED_MESSAGE : (caught as Error).message);
      }
    } finally {
      if (!reply) undoQuestion(question.id, replyId, parsed.data);

      setIsReplying(false);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isReplying) send(draft);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {assistantSuggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => send(suggestion)}
                className="h-full w-full rounded-card border border-line p-3 text-left text-sm transition-colors duration-300 ease-out hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div role="log" aria-live="polite" aria-busy={isReplying} className="flex flex-col gap-3">
          {messages.map((message) => (
            <p
              key={message.id}
              className={`max-w-[85%] rounded-card px-4 py-2.5 whitespace-pre-wrap ${
                message.role === "user" ? "self-end bg-primary text-white" : "self-start bg-surface-alt"
              }`}
            >
              {message.content || <span className="text-muted">Thinking...</span>}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      )}

      <FormMessage message={error} />

      <form onSubmit={handleSubmit} className="sticky bottom-4 mr-16 flex items-end gap-2 rounded-card border border-line bg-surface p-2 shadow-card lg:mr-0">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={ASSISTANT_MAX_MESSAGE_LENGTH}
          aria-label="Ask about your trip"
          placeholder="Ask about your trip"
          className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 outline-none placeholder:text-muted"
        />
        {isReplying ? (
          <Button type="button" variant="outline" onClick={() => abortRef.current?.abort()}>
            Stop
          </Button>
        ) : (
          <Button type="submit">
            <Icon name="send" />
            Send
          </Button>
        )}
      </form>
    </div>
  );
};

export default AssistantChat;
