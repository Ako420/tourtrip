import { z } from "zod";
import { getPassengerSlots, isValidBirthDate } from "@/lib/flightBooking";
import { emailField } from "./fields";

const nameField = (label: string) => {
  return z.string().trim().min(2, `Enter the ${label}`).max(60, `Use 60 characters or fewer`);
};

// Travelers change per booking, so the form's fields are built from the search.
const createFlightBookingSchema = (adults: number, children: number, departDate: string) => {
  const passengerFields = getPassengerSlots(adults, children).flatMap(({ key, type }) => [
    [`${key}FirstName`, nameField("first name")],
    [`${key}LastName`, nameField("last name")],
    [
      `${key}BirthDate`,
      z
        .string()
        .min(1, "Enter the date of birth")
        .refine((value) => isValidBirthDate(value, type, departDate), {
          error: type === "adult" ? "Adults must be 18 or older on departure" : "Children must be 2 to 17 on departure",
        }),
    ],
  ]);

  return z.object({
    ...Object.fromEntries(passengerFields),
    email: emailField,
    phone: z
      .string()
      .trim()
      .min(1, "Enter your phone number")
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
    acceptTerms: z.literal("on", { error: "Accept the booking terms to continue" }),
  });
};

export default createFlightBookingSchema;
