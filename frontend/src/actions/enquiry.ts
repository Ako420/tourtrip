"use server";

import { toLocalIsoDate } from "@/lib";
import { enquirySchema } from "@/schemas";
import { createEnquiry, getCruiseBySlug, getTourBySlug } from "@/services";
import type { EnquiryResponse, EnquirySubject, FormState } from "@/types";

// The tour or cruise and its dates come from our own data, never from the browser.
const checkSubject = async ({ type, slug }: EnquirySubject, date: string, travelers: number) => {
  if (type === "cruise") {
    const cruise = await getCruiseBySlug(slug);

    if (!cruise) return "This cruise is no longer available.";

    return cruise.sailings.some((sailing) => sailing.date === date)
      ? undefined
      : "This sailing is no longer available. Choose another date.";
  }

  const tour = await getTourBySlug(slug);

  if (!tour) return "This tour is no longer available.";
  if (tour.type === "private") return undefined;

  const departure = tour.departures.find((item) => item.date === date);

  if (!departure) return "This departure is no longer available. Choose another date.";

  return travelers > departure.seatsLeft
    ? `Only ${departure.seatsLeft} seats are left on this departure. Choose another date.`
    : undefined;
};

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

  const problem = await checkSubject(subject, date, travelers);

  if (problem) {
    return { message: problem };
  }

  try {
    return { result: await createEnquiry({ ...result.data, subject }) };
  } catch {
    return { message: "We could not send your enquiry. Please try again." };
  }
};
