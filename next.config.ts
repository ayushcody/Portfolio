import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CMS uploads (profile photo, project images) are served from Firebase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
