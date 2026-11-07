import { z } from "zod";

export const legalParamsSchema = z.object({ slug: z.string() });
