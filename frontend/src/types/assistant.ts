export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
};

export type AssistantEvent =
  | { type: "text"; text: string }
  | { type: "done"; stopReason: string | null }
  | { type: "error"; message: string };
