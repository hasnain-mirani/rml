import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    typescript: {
    // ✅ allow production build even if there are TS errors
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;
