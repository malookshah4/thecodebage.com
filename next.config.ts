import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  generateBuildId: async () => `build-${Date.now()}`,
};

export default nextConfig;
