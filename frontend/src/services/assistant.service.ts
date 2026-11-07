import type { AssistantRole } from "@/types";
import { apiStream, isApiLive } from "./http";

export const isAssistantLive = () => isApiLive("assistant");

export const streamAssistantReply = (messages: { role: AssistantRole; content: string }[], signal: AbortSignal) => {
  return apiStream("/assistant/chat", { messages }, { auth: true, signal });
};
