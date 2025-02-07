import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🔹 Ignore ESLint pendant le build
  },
};

export default nextConfig;
