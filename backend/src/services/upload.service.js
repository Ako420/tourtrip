import { cloudinary } from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";
import { getPageInfo } from "../utils/pagination.js";

export const ROOT_FOLDER = "hotel-jr";

const PAGE_SIZE = 20;

// A file's stated type can be faked, so Cloudinary checks the real format as well.
const ALLOWED_FORMATS = ["jpg", "png", "webp"];

const sendToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `${ROOT_FOLDER}/${folder}`, resource_type: "image", allowed_formats: ALLOWED_FORMATS },
      (error, result) => {
        if (error?.http_code === 400) {
          reject(new HttpError(400, "This file isn't a valid image", "INVALID_IMAGE"));
        } else if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

const removeFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
};

export const uploadImage = async ({ buffer, folder, userId }) => {
  const { public_id: publicId, secure_url: url, width, height, format, bytes } = await sendToCloudinary(buffer, folder);

  try {
    return await prisma.asset.create({
      data: { publicId, url, folder, width, height, format, bytes, uploadedById: userId },
    });
  } catch (error) {
    // Report the save failure even if the clean-up fails too.
    await removeFromCloudinary(publicId).catch(console.error);
    throw error;
  }
};

export const listImages = async ({ folder, page: requestedPage }) => {
  const where = { folder };
  const total = await prisma.asset.count({ where });
  const { page, pageCount, skip, take } = getPageInfo(total, requestedPage, PAGE_SIZE);
  const items = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" }, skip, take });

  return { items, total, page, pageCount };
};

export const deleteImage = async (id) => {
  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    throw new HttpError(404, "Image not found", "IMAGE_NOT_FOUND");
  }

  // The row goes last, so a failed delete can be tried again.
  await removeFromCloudinary(asset.publicId);
  await prisma.asset.delete({ where: { id } });
};
