import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env.js";

// The key is optional, so the rest of the API still runs without the assistant.
export const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;
