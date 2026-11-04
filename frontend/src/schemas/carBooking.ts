import { z } from "zod";
import { MIN_DRIVER_AGE, STANDARD_DRIVER_AGE } from "@/constants";
import { getAgeOnDate } from "@/lib/carSearch";
import { emailField } from "./fields";

const nameField = (label: string) => {
  return z.string().trim().min(2, `Enter the driver's ${label}`).max(60, "Use 60 characters or fewer");
};

// The price depends on the age ticked in the search, so the driver's real age must match it.
const createCarBookingSchema = (pickupDate: string, isStandardAge: boolean) => {
  return z.object({
    firstName: nameField("first name"),
    lastName: nameField("last name"),
    birthDate: z
      .string()
      .min(1, "Enter the driver's date of birth")
      .superRefine((birthDate, context) => {
        const age = getAgeOnDate(birthDate, pickupDate);
        const isStandard = age >= STANDARD_DRIVER_AGE.min && age <= STANDARD_DRIVER_AGE.max;

        if (age < MIN_DRIVER_AGE) {
          context.addIssue({ code: "custom", message: `Drivers must be at least ${MIN_DRIVER_AGE} at pick-up` });
        } else if (isStandardAge && !isStandard) {
          context.addIssue({ code: "custom", message: "This driver is outside ages 25 to 69. Update your search." });
        } else if (!isStandardAge && isStandard) {
          context.addIssue({ code: "custom", message: "This driver is aged 25 to 69. Update your search." });
        }
      }),
    email: emailField,
    phone: z
      .string()
      .trim()
      .min(1, "Enter your phone number")
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
    acceptTerms: z.literal("on", { error: "Accept the booking terms to continue" }),
  });
};

export default createCarBookingSchema;
