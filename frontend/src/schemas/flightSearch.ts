import { z } from "zod";

const flightSearchSchema = z
  .object({
    from: z.string().trim().min(2, "Enter a departure city"),
    to: z.string().trim().min(2, "Enter a destination"),
    tripType: z.enum(["round-trip", "one-way"]),
    departDate: z.string().min(1, "Choose a departure date"),
    returnDate: z.string().optional(),
  })
  .refine((values) => values.from.toLowerCase() !== values.to.toLowerCase(), {
    message: "Destination must be different from departure",
    path: ["to"],
  })
  .refine(
    (values) => {
      return values.tripType === "one-way" || Boolean(values.returnDate && values.returnDate > values.departDate);
    },
    { message: "Return must be after departure", path: ["returnDate"] },
  );

export default flightSearchSchema;
