import { z } from "zod";
import { ASSISTANT_MAX_MESSAGE_LENGTH } from "@/constants";

const assistantMessageSchema = z
  .string()
  .trim()
  .min(1, "Enter a message")
  .max(ASSISTANT_MAX_MESSAGE_LENGTH, `Messages must be ${ASSISTANT_MAX_MESSAGE_LENGTH} characters or fewer`);

export default assistantMessageSchema;
