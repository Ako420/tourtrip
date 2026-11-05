"use server";

import { toLocalIsoDate } from "@/lib";
import { enquirySchema } from "@/schemas";
import { createEnquiry, getTourBySlug } from "@/services";
import type { EnquiryResponse, EnquirySubject, FormState } from "@/types";

export const sendEnquiryAction = async (
  subject: EnquirySubject,
  values: unknown,
): Promise<FormState<EnquiryResponse>> => {
  const result = enquirySchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  const { date, travelers } = result.data;

  // Compare against yesterday so travelers ahead of the server's time zone can still choose today.
  if (date < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "That date has passed. Choose another date." };
  }

  // The tour and its departures come from our own data, never from the browser.
  const tour = await getTourBySlug(subject.slug);

  if (!tour) {
    return { message: "This tour is no longer available." };
  }

  if (tour.type === "group") {
    const departure = tour.departures.find((item) => item.date === date);

    if (!departure) {
      return { message: "This departure is no longer available. Choose another date." };
    }

    if (travelers > departure.seatsLeft) {
      return { message: `Only ${departure.seatsLeft} seats are left on this departure. Choose another date.` };
    }
  }

  try {
    return { result: await createEnquiry({ ...result.data, subject }) };
  } catch {
    return { message: "We could not send your enquiry. Please try again." };
  }
};
