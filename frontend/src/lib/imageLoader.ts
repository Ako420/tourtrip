import type { ImageLoaderProps } from "next/image";

// Unsplash resizes images on its own CDN, so browsers load them from there directly.
const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (!src.startsWith("https://images.unsplash.com/")) {
    return src;
  }

  const url = new URL(src);

  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));

  return url.toString();
};

export default imageLoader;
