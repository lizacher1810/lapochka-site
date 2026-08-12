import type { NextConfig } from "next";

// On GitHub Pages the site is served from a sub-path (/<repo>/), so the CI
// build sets NEXT_PUBLIC_BASE_PATH=/lapochka-site. Locally it's empty and the
// site runs from the root. The same var is read by lib/asset.ts to prefix the
// public/ assets that Next does NOT rewrite automatically (GLB, textures, imgs).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
