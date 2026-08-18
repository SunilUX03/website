import { NextResponse } from "next/server";
import { getSocialPosts } from "@/lib/cms/social-posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getSocialPosts("instagram");
  return NextResponse.json({ posts });
}
