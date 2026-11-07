import type { ImageLoaderProps } from "next/image";

// Cloudinary and Unsplash resize images on their own CDNs, so browsers load them from there directly.
const imageLoader = ({ src, width, quality = 75 }: ImageLoaderProps) => {
  if (src.startsWith("https://res.cloudinary.com/")) {
    return src.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }

  if (!src.startsWith("https://images.unsplash.com/")) {
    return src;
  }

  const url = new URL(src);

  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality));

  return url.toString();
};

export default imageLoader;
