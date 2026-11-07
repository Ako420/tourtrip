import { z } from "zod";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string("Enter a message")
    .trim()
    .min(1, "Enter a message")
    .max(MAX_MESSAGE_LENGTH, `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer`),
});

export const assistantChatSchema = z.object({
  messages: z
    .array(messageSchema, "Enter a message")
    .min(1, "Enter a message")
    .max(MAX_MESSAGES, `Send ${MAX_MESSAGES} messages or fewer`)
    .refine((messages) => messages.every(({ role }, index) => role === (index % 2 === 0 ? "user" : "assistant")), {
      message: "Messages must take turns, starting with the user",
    })
    .refine((messages) => messages.at(-1).role === "user", { message: "The last message must be from the user" }),
});
