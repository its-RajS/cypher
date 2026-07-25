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
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
