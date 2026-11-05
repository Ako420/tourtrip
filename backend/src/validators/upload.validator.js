import { z } from "zod";
import { page } from "../utils/validators.js";

const IMAGE_FOLDERS = [
  "hotels",
  "rooms",
  "attractions",
  "cars",
  "content",
  "deals",
  "guides",
  "avatars",
  "reviews",
  "moments",
  "support",
  "properties",
];

const folderField = z.enum(IMAGE_FOLDERS, "Choose a valid folder");

export const uploadSchema = z.object({ folder: folderField });

export const listUploadsSchema = z.object({ folder: folderField.optional(), page });

export const uploadParamsSchema = z.object({ id: z.string().min(1) });
