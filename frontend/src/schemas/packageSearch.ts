import { z } from "zod";

const packageSearchSchema = z
  .object({
    from: z.string().trim().min(2, "Enter a departure city"),
    to: z.string().trim().min(2, "Enter a destination"),
    departDate: z.string().min(1, "Choose a departure date"),
    returnDate: z.string().min(1, "Choose a return date"),
  })
  .refine((values) => values.from.toLowerCase() !== values.to.toLowerCase(), {
    message: "Destination must be different from departure",
    path: ["to"],
  })
  .refine((values) => values.returnDate > values.departDate, {
    message: "Return must be after departure",
    path: ["returnDate"],
  });

export default packageSearchSchema;
