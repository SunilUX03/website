import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Default is 1MB — the Services admin form can submit a hero photo plus
  // up to 4 product-tour photos in one Server Action request, which was
  // silently rejected past the default limit (surfacing as a failed page
  // load right after clicking Update/Publish).
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
