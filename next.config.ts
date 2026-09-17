import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: to disable Turbopack use NEXT_NO_TURBOPACK=1 env var at runtime

  async rewrites() {
    return {
      // `beforeFiles` is checked ahead of the filesystem, so this serves the
      // static marketing page at "/" while keeping the URL as "/".
      // The app itself lives at /login and /workspaces.
      beforeFiles: [
        {
          source: "/",
          destination: "/landing.html",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
