import type { Metadata } from "next";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import config from "@/payload.config";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Payload's RootPage types `params.segments` as always-present, but its
// own dashboard-detection logic actually distinguishes `undefined` (the
// bare /cms route) from `[]` — collapsing the two with `?? []` makes it
// compute a path with a trailing slash for the dashboard specifically,
// which fails to match any view and 404s. So `segments` is left exactly
// as Next.js provides it (present-but-empty and absent are different
// here) and only cast to satisfy the stricter declared type.
async function normalize({ params, searchParams }: Args) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return {
    params: Promise.resolve(resolvedParams) as Promise<{ segments: string[] }>,
    searchParams: Promise.resolve(
      Object.fromEntries(
        Object.entries(resolvedSearchParams).filter(([, value]) => value !== undefined)
      ) as Record<string, string | string[]>
    ),
  };
}

export const generateMetadata = async (args: Args): Promise<Metadata> =>
  generatePageMetadata({ config, ...(await normalize(args)) });

export default async function Page(args: Args) {
  return RootPage({ config, importMap, ...(await normalize(args)) });
}
