import { NextResponse } from "next/server";
import { getSocialPosts } from "@/lib/cms/social-posts";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export async function GET() {
  const locale = await getLocale();
  const posts = await getSocialPosts("x", locale);
  return NextResponse.json({ posts });
}
