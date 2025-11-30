import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
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
