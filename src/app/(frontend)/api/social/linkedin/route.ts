import { NextResponse } from "next/server";
import { SOCIAL_SEED } from "@/lib/social-seed-data";

// Re-fetch at most every 30 min once this calls the real LinkedIn API, so
// we respect rate limits instead of hitting it on every page load.
export const revalidate = 1800;

// TODO: once a LinkedIn app + organization access token are provisioned,
// replace the body below with a server-side call to the LinkedIn API
// (organization posts) using a token read from process.env — never
// expose that token to the client. The response shape below is what the
// client expects regardless of where the data comes from.
export async function GET() {
  return NextResponse.json({ posts: SOCIAL_SEED.linkedin });
}
