import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@anthropic-ai/sdk"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/presentation",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
