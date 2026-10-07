import type { NextFetchEvent, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const careerPortalGuard = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/career-portal/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/career-portal/login", req.nextUrl.origin);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/career-portal/dashboard", req.nextUrl.origin));
  }
});

// While MAINTENANCE_MODE=true every public page answers with the
// maintenance page and a real 503 (plus Retry-After, so search engines
// treat it as temporary rather than as the pages being gone). Staff areas
// and their APIs stay reachable so the CMS and HR portal keep working.
const MAINTENANCE_EXEMPT = ["/maintenance", "/cms", "/career-portal", "/api"];

function isMaintenanceExempt(pathname: string) {
  return MAINTENANCE_EXEMPT.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (process.env.MAINTENANCE_MODE === "true" && !isMaintenanceExempt(pathname)) {
    return NextResponse.rewrite(new URL("/maintenance", req.url), {
      status: 503,
      headers: { "Retry-After": "3600" },
    });
  }

  if (pathname === "/career-portal" || pathname.startsWith("/career-portal/")) {
    // NextAuth types the second argument for route handlers; in a proxy it
    // is the fetch event, which its wrapper passes straight through.
    return careerPortalGuard(req, event as unknown as Parameters<typeof careerPortalGuard>[1]);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets and the static asset folders, so
  // the maintenance page can still load its scripts and styles.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/|images/|media/|documents/).*)"],
};
