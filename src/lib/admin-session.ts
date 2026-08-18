import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Call at the top of every protected Career Portal page/layout —
 * redirects to login rather than rendering anything if there's no valid
 * NextAuth session. The old /admin/careers page called `auth()` directly
 * and never actually redirected on a missing session, silently rendering
 * the applications table to anyone — this is the fix, matching the same
 * requireSession() pattern the CMS portal already uses. */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) redirect("/career-portal/login");
  return session;
}
