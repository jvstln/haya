import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ['@tryhaya/analytics'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "usehaya.io",
      },
      {
        protocol: "https",
        hostname: "*.usehaya.io",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
