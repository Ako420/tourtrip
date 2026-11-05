import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { cloudinary } from "../src/config/cloudinary.js";
import { env } from "../src/config/env.js";
import { ROOT_FOLDER } from "../src/services/upload.service.js";

const UNSPLASH_URL = "https://images.unsplash.com/";
const SOURCE_WIDTH = "2000";

const readMap = (mapPath) => (existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, "utf8")) : {});

const writeMap = (mapPath, map) => {
  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));

  writeFileSync(mapPath, `${JSON.stringify(sorted, null, 2)}\n`);
};

export const createImageHost = ({ mapPath, skipUploads }) => {
  const hostImage = async (url, folder) => {
    if (skipUploads || !url.startsWith(UNSPLASH_URL)) {
      return url;
    }

    const source = new URL(url);
    const photoId = source.pathname.slice(1);
    const map = readMap(mapPath);

    // The sample data uses one photo at several widths, so the width isn't part of the key.
    if (map[photoId]) {
      return map[photoId];
    }

    source.searchParams.set("w", SOURCE_WIDTH);

    try {
      const { secure_url: hostedUrl } = await cloudinary.uploader.upload(source.href, {
        public_id: photoId,
        folder: `${ROOT_FOLDER}/${folder}`,
        resource_type: "image",
        overwrite: false,
      });

      // Saved after every upload, so a failed seed picks up where it stopped.
      writeMap(mapPath, { ...map, [photoId]: hostedUrl });

      return hostedUrl;
    } catch (error) {
      throw new Error(`Could not host ${url}: ${error.message}`);
    }
  };

  // One at a time, so a large seed doesn't flood Cloudinary or the map file.
  const hostImages = async (value, folder) => {
    if (typeof value === "string") {
      return hostImage(value, folder);
    }

    if (Array.isArray(value)) {
      const items = [];

      for (const item of value) {
        items.push(await hostImages(item, folder));
      }

      return items;
    }

    if (value && typeof value === "object") {
      const entries = [];

      for (const [key, item] of Object.entries(value)) {
        entries.push([key, await hostImages(item, folder)]);
      }

      return Object.fromEntries(entries);
    }

    return value;
  };

  return { hostImage, hostImages };
};

export const { hostImage, hostImages } = createImageHost({
  mapPath: new URL("./seed-data/image-map.json", import.meta.url),
  skipUploads: env.NODE_ENV === "test",
});
