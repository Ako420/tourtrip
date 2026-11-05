import { prisma } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";

const LEGAL_SLUGS = ["terms", "privacy"];

const throwNotFound = () => {
  throw new HttpError(404, "Content not found", "CONTENT_NOT_FOUND");
};

export const getContent = async (key) => {
  const block = await prisma.contentBlock.findUnique({ where: { key } });

  return block ? block.data : throwNotFound();
};

export const getLegalDocument = async (slug) => {
  return LEGAL_SLUGS.includes(slug) ? getContent(`legal-${slug}`) : throwNotFound();
};
