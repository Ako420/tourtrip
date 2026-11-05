import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
  // Search links used to open on /hotels, which is now the landing page.
  redirects: async () => [
    {
      source: "/hotels",
      has: [{ type: "query", key: "destination" }],
      destination: "/hotels/list",
      permanent: true,
    },
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
