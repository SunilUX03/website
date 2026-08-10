import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Default is 1MB — the Services admin form can submit a hero photo plus
  // up to 4 product-tour photos in one Server Action request, which was
  // silently rejected past the default limit (surfacing as a failed page
  // load right after clicking Update/Publish). Capped at 4mb, not higher:
  // Vercel Functions hard-reject any request body over 4.5MB at the
  // platform level regardless of what this option allows, so setting this
  // above that is misleading — ServiceForm's own client-side size checks
  // (see MAX_TOTAL_UPLOAD_BYTES) are what actually keep uploads under it.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
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
      // Where CMS uploads (Media/Documents collections) actually live —
      // Vercel Blob's public URLs, one subdomain per store. Without this,
      // next/image throws on any real uploaded photo (only the seed/
      // placeholder domains above were ever whitelisted), which crashed
      // the whole page with no error boundary to catch it.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
