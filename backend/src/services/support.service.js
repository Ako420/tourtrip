import { prisma } from "../config/db.js";
import { generateReference } from "../utils/reference.js";

export const getFaqs = () => {
  return prisma.faq.findMany({
    select: { id: true, product: true, question: true, answer: true },
    orderBy: [{ sortRank: "asc" }, { id: "asc" }],
  });
};

export const createTicket = (ticket, userId) => {
  return prisma.supportTicket.create({
    data: { ...ticket, userId, reference: generateReference("SUP") },
    select: { reference: true },
  });
};
