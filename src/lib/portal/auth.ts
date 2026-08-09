import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload-client";

const COOKIE_NAME = "cms_token";

export type PortalUser = {
  id: number;
  email: string;
  name?: string | null;
  role: "editor" | "admin";
};

/** Verifies credentials against Payload's own auth (bcrypt hashing,
 * lockout on repeated failures — all built in) and hands back a JWT.
 * We store that token in our own cookie and reconstruct the
 * `Authorization: JWT <token>` header Payload's strategy expects on every
 * subsequent request, rather than depending on Payload's own default
 * cookie-naming convention — keeps this custom admin fully decoupled
 * from Payload's own (now-removed) admin UI assumptions. */
export async function login(email: string, password: string): Promise<{ error: string } | { ok: true }> {
  const payload = await getPayloadClient();
  try {
    const result = await payload.login({
      collection: "cms-users",
      data: { email, password },
    });
    if (!result.token) return { error: "Login failed. Try again." };

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { ok: true };
  } catch {
    return { error: "Incorrect email or password." };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Returns the logged-in CMS user, or null. Safe to call anywhere on the
 * server — never throws, never redirects (see requireSession for that). */
export async function getSession(): Promise<PortalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await getPayloadClient();
  const { user } = await payload.auth({
    headers: new Headers({ Authorization: `JWT ${token}` }),
  });
  if (!user || user.collection !== "cms-users") return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

/** Call at the top of every protected admin page/layout — redirects to
 * login rather than rendering anything if there's no valid session. */
export async function requireSession(): Promise<PortalUser> {
  const user = await getSession();
  if (!user) redirect("/cms/login");
  return user;
}
