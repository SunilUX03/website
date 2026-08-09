import { NextResponse } from "next/server";
import { SOCIAL_SEED } from "@/lib/social-seed-data";

// Re-fetch at most every 30 min once this calls the real YouTube Data API,
// so we respect rate limits instead of hitting it on every page load.
export const revalidate = 1800;

// TODO: once a YouTube Data API key + channel id are provisioned, replace
// the body below with a server-side call to the YouTube Data API
// (search.list / playlistItems.list for the channel's uploads) using a key
// read from process.env — never expose that key to the client. The
// response shape below is what the client expects regardless of where the
// data comes from.
export async function GET() {
  return NextResponse.json({ posts: SOCIAL_SEED.youtube });
}
