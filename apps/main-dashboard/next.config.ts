import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Keep Turbopack's resolver and file watcher inside this standalone app.
  // Without this, its lockfile discovery selects /home/its-raj as the root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
