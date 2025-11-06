import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy server-only packages external to avoid Turbopack ESM quirks
  serverExternalPackages: ["pdfkit", "fontkit", "linebreak", "png-js"]
};

export default nextConfig;
