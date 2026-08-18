import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
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

export const config = {
  matcher: ["/career-portal/:path*"],
};
