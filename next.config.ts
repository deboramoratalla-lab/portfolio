import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: { qualities: [75, 92] },
  async redirects() {
    return [
      { source: "/projects/saas", destination: "/projects/board", permanent: true },
      { source: "/projects/saas/:path*", destination: "/projects/board/:path*", permanent: true },
    ]
  },
};

export default nextConfig;
