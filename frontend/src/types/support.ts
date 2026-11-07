import type { IconName } from "@/constants";

export type SupportProductId = "flights" | "hotels" | "trains" | "cars" | "attractions" | "account";

export type SupportProduct = {
  id: SupportProductId;
  label: string;
  iconName: IconName;
};

export type SupportFaq = {
  id: string;
  product: SupportProductId;
  question: string;
  answer: string;
};

export type SupportOption = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconName: IconName;
};

export type SupportTicketRequest = {
  fullName: string;
  email: string;
  topic: string;
  bookingReference?: string;
  message: string;
};

export type SupportTicketResponse = {
  reference: string;
};
