import type { Metadata } from "next";
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views";
import config from "@/payload.config";
import { importMap } from "../importMap";

// Deliberately doesn't rely on receiving params/searchParams as props —
// confirmed by testing that Next renders this without them whenever
// Payload's own RootPage calls notFound() internally (e.g. an
// unrecognized sub-route inside /cms), not just on a raw URL mismatch.
const emptyParams = Promise.resolve({ segments: [] });
const emptySearchParams = Promise.resolve({});

export const generateMetadata = (): Promise<Metadata> =>
  generatePageMetadata({ config, params: emptyParams, searchParams: emptySearchParams });

export default function NotFound() {
  return NotFoundPage({ config, importMap, params: emptyParams, searchParams: emptySearchParams });
}
